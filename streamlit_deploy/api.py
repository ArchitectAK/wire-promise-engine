"""
FastAPI backend for Wire Manufacturing AI — Promise Date Engine.
Exposes the 5-layer ML pipeline via REST so the React frontend can call it.

Run:
    uvicorn api:app --reload --port 8000
"""

import io
import os
import sys
from datetime import datetime
from typing import Optional

import pandas as pd
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from engine import PromiseDateEngine, PromiseDateReport  # noqa: E402

app = FastAPI(title="Wire Manufacturing AI — Promise Date API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_engine: Optional[PromiseDateEngine] = None


def get_engine() -> PromiseDateEngine:
    global _engine
    if _engine is None:
        _engine = PromiseDateEngine()
    return _engine


@app.on_event("startup")
def _startup():
    get_engine()


# ── Input schema ──────────────────────────────────────────────────────────────

class OrderInput(BaseModel):
    order_id: str = ""
    order_date: str = ""
    item_type: str
    wire_diameter_mm: float
    qty_ordered_kg: float
    package_code: str = "KH"
    mill_assigned: str
    num_lines_per_SO: int = 3
    total_qty_per_SO: float = 20000.0
    unique_diameters_per_SO: int = 2
    concurrent_orders_this_week: int = 10
    concurrent_same_mill_orders: int = 3
    week_total_load_kg: float = 120000.0
    diameter_group_load_kg: float = 200000.0
    previous_order_diameter_on_mill: float = 2.0
    order_month: Optional[int] = None
    order_day_of_week: Optional[int] = None


# ── Serialisation helper ──────────────────────────────────────────────────────

def _report_to_dict(r: PromiseDateReport) -> dict:
    return {
        "order_id": r.order_id,
        "order_date": r.order_date,
        "layer1": {
            "nominal_run_rate_kghr": r.nominal_run_rate_kghr,
            "adjusted_run_rate_kghr": r.adjusted_run_rate_kghr,
            "adjustment_pct": r.run_rate_adjustment_pct,
        },
        "layer2": {
            "base_lead_time_days": r.base_lead_time_days,
            "queue_adjusted_days": r.queue_adjusted_days,
            "queue_contention_pct": r.queue_contention_pct,
        },
        "layer3": {
            "random_setup_min": r.random_setup_min,
            "ml_optimized_setup_min": r.ml_optimized_setup_min,
            "setup_savings_pct": r.setup_savings_pct,
            "setup_adjustment_days": r.setup_adjustment_days,
        },
        "layer4": {
            "p10_days": r.p10_days,
            "p50_days": r.p50_days,
            "p90_days": r.p90_days,
            "promise_date_p10": r.promise_date_p10,
            "promise_date_p50": r.promise_date_p50,
            "promise_date_p90": r.promise_date_p90,
            "prob_exceed_42d": r.prob_exceed_42days,
            "guardrail_flag": r.guardrail_flag,
        },
        "layer5": {
            "otif_risk_probability": r.otif_risk_probability,
            "otif_risk_label": r.otif_risk_label,
        },
        "shap_top3": [
            {"feature": f, "impact_days": round(v, 3), "description": d}
            for f, v, d in r.shap_top3
        ],
        "guardrail_warnings": r.guardrail_warnings,
    }


def _derive_date_fields(order_dict: dict) -> dict:
    if order_dict.get("order_month") is None:
        try:
            dt = datetime.strptime(order_dict["order_date"], "%Y-%m-%d")
            order_dict["order_month"] = dt.month
            order_dict["order_day_of_week"] = dt.weekday()
        except Exception:
            order_dict["order_month"] = datetime.today().month
            order_dict["order_day_of_week"] = 0
    return order_dict


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(order: OrderInput):
    order_dict = order.model_dump()
    if not order_dict.get("order_date"):
        order_dict["order_date"] = datetime.today().strftime("%Y-%m-%d")
    if not order_dict.get("order_id"):
        order_dict["order_id"] = f"SO-{datetime.today().strftime('%Y%m%d')}-001"
    order_dict = _derive_date_fields(order_dict)
    try:
        report = get_engine().predict(order_dict)
        return _report_to_dict(report)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/predict/batch")
async def predict_batch(file: UploadFile = File(...)):
    content = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"CSV parse error: {exc}")

    num_cols = [
        "wire_diameter_mm", "qty_ordered_kg", "num_lines_per_SO",
        "total_qty_per_SO", "unique_diameters_per_SO", "diameter_group_load_kg",
        "concurrent_orders_this_week", "concurrent_same_mill_orders",
        "week_total_load_kg", "previous_order_diameter_on_mill",
        "order_month", "order_day_of_week",
    ]

    results, errors = [], []
    for _, row in df.iterrows():
        order_dict = row.to_dict()
        for col in num_cols:
            if col in order_dict:
                try:
                    val = order_dict[col]
                    if pd.notna(val):
                        order_dict[col] = float(val)
                except (ValueError, TypeError):
                    pass
        order_dict = _derive_date_fields(order_dict)
        try:
            report = get_engine().predict(order_dict)
            results.append(_report_to_dict(report))
        except Exception as exc:
            errors.append({"order_id": str(order_dict.get("order_id", "?")), "error": str(exc)})

    return {"results": results, "errors": errors}

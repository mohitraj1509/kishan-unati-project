"""
Risk assessment engine for Kisan Unnati
Calculates market risk levels for crops based on various factors
"""

import numpy as np
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

def calculate_oversupply_risk(current_area, last_year_area):
    """
    Calculate crop oversupply risk based on area changes
    
    Parameters:
    - current_area: Current planting area (acres)
    - last_year_area: Last year's planting area (acres)
    
    Returns:
    - Risk level: "High" / "Medium" / "Low"
    """
    if last_year_area == 0:
        return "Medium"
    
    # Calculate percentage increase
    increase = ((current_area - last_year_area) / last_year_area) * 100
    
    if increase > 20:
        return "High"
    elif 10 <= increase <= 20:
        return "Medium"
    else:
        return "Low"

def calculate_market_volatility_risk(price_history):
    """
    Calculate risk based on price volatility
    
    Parameters:
    - price_history: List of prices
    
    Returns:
    - Risk level and volatility percentage
    """
    if len(price_history) < 2:
        return "Medium", 50.0
    
    prices = np.array(price_history)
    volatility = (np.std(prices) / np.mean(prices)) * 100 if np.mean(prices) > 0 else 50
    
    if volatility > 30:
        risk = "High"
    elif volatility > 15:
        risk = "Medium"
    else:
        risk = "Low"
    
    return risk, volatility

def calculate_seasonal_demand_risk(crop, current_month):
    """
    Calculate risk based on seasonal demand patterns
    
    Parameters:
    - crop: Crop name
    - current_month: Current month (1-12)
    
    Returns:
    - Risk level based on seasonal demand
    """
    
    # Define high demand months for different crops
    crop_seasons = {
        'wheat': [3, 4, 5],           # March-May (harvest & storage)
        'rice': [10, 11, 12, 1],      # Oct-Jan (harvest season)
        'corn': [9, 10, 11],          # Sept-Nov (harvest)
        'cotton': [11, 12, 1],        # Nov-Jan (ginning season)
        'sugarcane': [11, 12, 1, 2],  # Nov-Feb (crushing season)
        'potato': [3, 4, 5, 6],       # March-June (harvest & storage)
        'onion': [1, 2, 3, 4],        # Jan-April (storage sales)
        'tomato': [6, 7, 8, 9],       # June-Sept (monsoon crops)
        'pulses': [8, 9, 10],         # Aug-Oct (harvest)
        'oilseeds': [10, 11, 12],     # Oct-Dec (harvest)
    }
    
    crop_lower = crop.lower()
    high_demand_months = crop_seasons.get(crop_lower, [])
    
    if current_month in high_demand_months:
        return "Low"  # High demand = lower risk
    else:
        return "Medium"  # Off-season = higher risk

def calculate_supply_chain_risk(crop, district):
    """
    Calculate risk based on supply chain factors
    
    Parameters:
    - crop: Crop name
    - district: District name
    
    Returns:
    - Risk level based on supply chain factors
    """
    # In a real scenario, this would query a database or API
    # For now, return mock assessment
    
    return "Medium"

def generate_risk_factors(crop, district, price_trend):
    """
    Generate a list of risk factors
    
    Parameters:
    - crop: Crop name
    - district: District name
    - price_trend: "increasing" / "decreasing" / "stable"
    
    Returns:
    - List of risk factors with percentages
    """
    
    factors = []
    
    # Market volatility
    volatility_pct = np.random.randint(15, 35)
    factors.append(f"Market volatility: {volatility_pct}%")
    
    # Supply variation
    supply_pct = np.random.randint(10, 25)
    factors.append(f"Supply variation: {supply_pct}%")
    
    # Seasonal demand
    seasonal_pct = np.random.randint(8, 20)
    factors.append(f"Seasonal demand: {seasonal_pct}%")
    
    # Weather impact
    weather_pct = np.random.randint(15, 30)
    factors.append(f"Weather impact: {weather_pct}%")
    
    # Price trend impact
    if price_trend == "decreasing":
        trend_pct = np.random.randint(20, 40)
        factors.append(f"Price declining trend: {trend_pct}%")
    elif price_trend == "increasing":
        factors.append("Price increasing trend: Low risk")
    
    return factors

def assess_overall_risk(crop, district, current_area=None, last_year_area=None, price_history=None):
    """
    Assess overall market risk for a crop in a district
    
    Parameters:
    - crop: Crop name
    - district: District name
    - current_area: Current planting area (optional)
    - last_year_area: Last year's planting area (optional)
    - price_history: List of historical prices (optional)
    
    Returns:
    - Overall risk assessment with detailed breakdown
    """
    
    risks = []
    
    # Oversupply risk
    if current_area and last_year_area:
        oversupply_risk = calculate_oversupply_risk(current_area, last_year_area)
        risks.append(oversupply_risk)
    
    # Volatility risk
    if price_history and len(price_history) > 1:
        volatility_risk, _ = calculate_market_volatility_risk(price_history)
        risks.append(volatility_risk)
    else:
        risks.append("Medium")
    
    # Seasonal risk
    current_month = datetime.now().month
    seasonal_risk = calculate_seasonal_demand_risk(crop, current_month)
    risks.append(seasonal_risk)
    
    # Determine overall risk
    if "High" in risks:
        overall_risk = "High"
    elif risks.count("Medium") >= 2:
        overall_risk = "Medium"
    else:
        overall_risk = "Low"
    
    # Generate factors
    price_trend = "stable"
    if price_history and len(price_history) > 1:
        if price_history[-1] > price_history[0]:
            price_trend = "increasing"
        elif price_history[-1] < price_history[0]:
            price_trend = "decreasing"
    
    factors = generate_risk_factors(crop, district, price_trend)
    
    return {
        "overall_risk": overall_risk,
        "detailed_risks": {
            "oversupply": risks[0] if len(risks) > 0 else "Medium",
            "volatility": risks[1] if len(risks) > 1 else "Medium",
            "seasonal": risks[2] if len(risks) > 2 else "Medium"
        },
        "risk_factors": factors,
        "recommendations": generate_recommendations(overall_risk, crop),
        "assessment_date": datetime.now().isoformat()
    }

def generate_recommendations(risk_level, crop):
    """
    Generate recommendations based on risk level
    
    Parameters:
    - risk_level: "High" / "Medium" / "Low"
    - crop: Crop name
    
    Returns:
    - List of recommendations
    """
    
    if risk_level == "High":
        return [
            "Consider delaying harvest",
            "Explore alternative markets",
            "Look into value addition opportunities",
            "Consider contract farming options"
        ]
    elif risk_level == "Medium":
        return [
            "Monitor market trends closely",
            "Plan harvest timing strategically",
            "Explore multiple selling channels",
            "Consider storage options"
        ]
    else:  # Low risk
        return [
            "Good time to plan harvest",
            "Expect favorable prices",
            "Can plan market sales directly",
            "Consider bulk selling if possible"
        ]

# Export main functions
__all__ = [
    'calculate_oversupply_risk',
    'calculate_market_volatility_risk',
    'calculate_seasonal_demand_risk',
    'calculate_supply_chain_risk',
    'generate_risk_factors',
    'assess_overall_risk',
    'generate_recommendations',
    'generate_mock_price_history'
]

def generate_mock_price_history(months=12):
    """Generate mock price history for testing"""
    month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    history = []
    
    # Generate realistic price variations
    base_price = 2000
    current_price = base_price
    
    for i in range(months):
        # Add seasonal variation
        seasonal_factor = np.sin((i / 12) * 2 * np.pi) * 200
        # Add random walk
        random_walk = np.random.normal(0, 100)
        
        current_price = base_price + seasonal_factor + random_walk
        current_price = max(1500, min(3000, current_price))  # Keep within range
        
        month_index = i % 12
        history.append({
            "month": month_names[month_index],
            "price": round(current_price, 2)
        })
    
    return history

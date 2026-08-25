# AgriRisk Implementation Plan

## 1. Updated Product Understanding

This plan is based on the updated PRD v2.0.

AgriRisk is an AI-powered agricultural decision intelligence platform. Its core promise is:

```text
Before you plant, AgriRisk helps you choose.
After you plant, AgriRisk helps you manage.
```

The product is not only a crop recommendation app, not only a risk dashboard, and not only an ML prediction interface. It must support the complete farming decision lifecycle:

```text
Choose -> Cultivate -> Monitor -> Predict -> Explain -> Recommend -> Simulate -> Act
```

The updated PRD introduces two equally important intelligence journeys:

- Before planting: help the farmer decide what crop to grow.
- After planting: help the farmer manage the crop through its lifecycle.

This means the MVP must prioritize Crop Advisor, Crop Comparison, Crop Cycles, Crop Health, Crop Risk, AI Copilot, Recommendations, Simulator, Regional Risk, and Alerts as one connected workflow.

## 2. Current Workspace Status

- Workspace: `D:\AgriRisk`
- Existing implementation: none
- Current file: `AGRIRISK_IMPLEMENTATION_PLAN.md`
- Implementation status: planning only
- User rule: all API keys and secrets must be stored in environment files

## 3. MVP Product Spine

The MVP should tell one coherent story instead of presenting disconnected pages.

Recommended hackathon story:

1. A farmer has 5 acres in Thanjavur.
2. The farmer enters land, soil, water, and season details.
3. Crop Advisor answers: "What should I grow?"
4. The system ranks Rice, Groundnut, Maize, and Cotton.
5. The farmer opens Rice and sees suitability, risk, yield, market, water, and profit estimates.
6. The farmer asks why Rice is recommended and why Cotton is less suitable.
7. The farmer selects Rice and creates a Kharif 2026 crop cycle.
8. The crop is 45 days old in the vegetative stage.
9. The system shows crop health, crop risk, growth-stage context, and risk factors.
10. AI Copilot answers: "What should I do now?"
11. The farmer simulates rainfall reduction and temperature increase.
12. The system estimates risk, yield, revenue, and loss changes.
13. Recommendations compare interventions by cost, risk reduction, and benefit.
14. Regional map shows the same risk pattern at farm, district, state, and India levels.
15. Alerts show drought or crop-stress warnings with expected timeframe.

This story proves the updated PRD's core message:

```text
AgriRisk transforms agricultural data into decisions.
```

## 4. P0 Scope

The updated PRD says the MVP should prioritize depth over feature count. P0 should include:

- Supabase authentication with Google and email/password.
- Protected routes.
- User profile creation.
- Farm CRUD.
- Soil, water, and location capture.
- Crop Advisor.
- Crop suitability scoring.
- Crop ranking.
- Crop comparison.
- Crop decision score.
- Crop risk score.
- Expected yield estimates.
- Economic estimates.
- Crop cycle creation.
- Growth stage tracking.
- Crop health score.
- Dynamic crop risk score.
- Risk factors and explanations.
- AI Copilot UI and contextual responses.
- AI recommendations.
- Basic what-if simulator.
- Regional risk map.
- Early warning alerts.
- Mock intelligence services separated from UI.
- Environment-based secret handling.
- Responsive, production-quality UX.

## 5. P1 Scope

After the P0 story works well:

- Crop image intelligence.
- Climate scenarios.
- Market forecasting.
- Intervention optimization refinements.
- Advanced analytics.
- Crop health timeline.
- Satellite-derived intelligence.
- Advanced RAG knowledge base.

## 6. P2 Scope

Longer-term platform expansion:

- Insurance intelligence.
- Agricultural lending intelligence.
- Government dashboard.
- Full digital farm twin.
- Automated alerts.
- IoT integration.
- Drone imagery.
- Satellite monitoring.
- Regional production forecasting.
- Supply-chain risk intelligence.

## 7. Recommended Stack

- Frontend: Next.js App Router, React, TypeScript.
- Styling: Tailwind CSS.
- Components: shadcn/ui.
- Icons: Lucide React.
- Charts: Recharts.
- Maps: Leaflet first, Mapbox optional later.
- Database: Supabase PostgreSQL.
- Auth: Supabase Auth with Google OAuth.
- Backend: Next.js API routes and server actions.
- Validation: Zod.
- AI: LLM-backed server routes later, mock intelligence first.
- ML: external/future services behind stable contracts.

## 8. Environment File Plan

Create:

- `.env.local`
- `.env.example`
- `.gitignore`

`.env.local` should store real values only and must never be committed:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
WEATHER_API_KEY=
MARKET_DATA_API_KEY=
SATELLITE_DATA_API_KEY=
MAPBOX_ACCESS_TOKEN=
```

`.env.example` should store placeholders only:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-api-key
WEATHER_API_KEY=your-weather-api-key
MARKET_DATA_API_KEY=your-market-data-api-key
SATELLITE_DATA_API_KEY=your-satellite-data-api-key
MAPBOX_ACCESS_TOKEN=your-mapbox-access-token
```

Security rules:

- Only `NEXT_PUBLIC_*` variables may be used in client components.
- `SUPABASE_SERVICE_ROLE_KEY` must stay server-only.
- `OPENAI_API_KEY` must stay server-only.
- Weather, market, satellite, and future ML keys must stay server-only.
- Add `.env.local` and all local env variants to `.gitignore`.
- Add typed env validation under `src/lib/env`.

## 9. Architecture

Use a modular intelligence architecture:

```text
UI Components
  -> Feature View Models
    -> API Routes / Server Actions
      -> Repositories
      -> Intelligence Services
        -> Mock Services now
        -> AI / ML / External Data Services later
```

Key architectural rules:

- UI must not depend on raw ML outputs.
- UI must not depend directly on Supabase row shapes.
- UI should consume typed view models.
- Mock intelligence must be replaceable without changing feature screens.
- Crop decision, crop risk, recommendations, simulator, and copilot must share the same domain context.

Core service interfaces:

- `ProfileRepository`
- `FarmRepository`
- `CropCycleRepository`
- `ObservationRepository`
- `CropAdvisorService`
- `CropSuitabilityService`
- `CropDecisionScoreService`
- `CropRiskService`
- `CropHealthService`
- `YieldForecastService`
- `EconomicEstimateService`
- `RecommendationService`
- `InterventionOptimizerService`
- `SimulationService`
- `CopilotService`
- `RegionalRiskService`
- `AlertService`
- `ClimateIntelligenceService`
- `MarketIntelligenceService`

Initial implementations:

- `MockCropAdvisorService`
- `MockCropRiskService`
- `MockCropHealthService`
- `MockRecommendationService`
- `MockSimulationService`
- `MockCopilotService`
- `MockRegionalRiskService`
- `MockAlertService`

Future replacements:

- `MLCropAdvisorService`
- `MLCropRiskService`
- `AIRecommendationService`
- `RagCopilotService`
- `WeatherSignalService`
- `MarketSignalService`
- `SatelliteCropHealthService`

## 10. Proposed Folder Structure

```text
src/
  app/
    (auth)/
      login/
      signup/
      reset-password/
    (protected)/
      dashboard/
      crop-advisor/
      crop-advisor/compare/
      crop-advisor/[crop]/
      farms/
      farms/[farmId]/
      farms/[farmId]/crops/[cropCycleId]/
      risk/
      copilot/
      recommendations/
      simulator/
      risk-map/
      alerts/
      climate/
      market/
      analytics/
      industry/
      settings/
    api/
      farms/
      farms/[farmId]/
      crop-advisor/
      crop-advisor/compare/
      crop-cycles/
      crop-cycles/[cropCycleId]/
      crop-cycles/[cropCycleId]/risk/
      crop-cycles/[cropCycleId]/health/
      recommendations/
      recommendations/analyze/
      simulate/
      copilot/
      risk/regions/
      alerts/
  components/
    app-shell/
    auth/
    dashboard/
    crop-advisor/
    crop-cycle/
    farms/
    risk/
    copilot/
    recommendations/
    simulator/
    region-map/
    alerts/
    charts/
    feedback/
    ui/
  lib/
    auth/
    env/
    supabase/
    repositories/
    services/
    mock/
    scoring/
    view-models/
    validation/
    utils/
  types/
supabase/
  migrations/
  seed.sql
```

## 11. Database Plan

Create Supabase migrations for the PRD tables:

- `profiles`
- `farms`
- `crop_cycles`
- `crop_recommendations`
- `crop_decision_scores`
- `crop_health_snapshots`
- `risk_predictions`
- `risk_factors`
- `recommendations`
- `crop_observations`
- `simulations`
- `alerts`
- `conversations`
- `conversation_messages`

Recommended supporting tables:

- `regions`
- `regional_risk_snapshots`
- `data_sources`
- `interventions`
- `market_price_snapshots`
- `weather_snapshots`
- `soil_snapshots`
- `crop_catalog`
- `crop_stage_requirements`

Why these supporting tables matter:

- `crop_catalog` stores crop requirements and makes Crop Advisor explainable.
- `crop_stage_requirements` lets recommendations change by growth stage.
- `data_sources` supports freshness and trust labels.
- `interventions` supports optimization and cost comparison.
- `regions` and `regional_risk_snapshots` support district, state, and national intelligence.

## 12. RLS And Security Plan

Enable RLS for all user-owned tables.

Users can only access their own:

- Profiles.
- Farms.
- Crop cycles.
- Crop recommendations.
- Crop decision scores.
- Crop health snapshots.
- Risk predictions.
- Risk factors linked through owned predictions.
- Recommendations linked through owned crop cycles.
- Crop observations.
- Simulations.
- Alerts.
- Conversations and messages.

Shared or public-read tables:

- `regions`
- `crop_catalog`
- public regional risk summaries, if allowed

Security implementation:

- Validate all server-side inputs with Zod.
- Keep service-role credentials server-only.
- Protect all app routes under `(protected)`.
- Add rate limiting later for AI endpoints.
- Validate file uploads before enabling crop image intelligence.

## 13. Authentication And Roles

Auth requirements:

- Google OAuth as primary onboarding.
- Email/password signup.
- Email/password login.
- Sign out.
- Password reset.
- Profile creation after signup.
- Protected app routes.

User roles:

- `farmer`
- `agronomist`
- `researcher`
- `agribusiness`
- `insurance`
- `lender`
- `government`
- `admin`

MVP role strategy:

- Focus on the farmer experience first.
- Store role in the profile.
- Use role-aware navigation and layout hooks.
- Keep industry views lightweight until P1/P2.

## 14. Navigation Plan

Main navigation should reflect the updated modules:

```text
Overview
- Dashboard

Before Planting
- Crop Advisor
- Crop Comparison

After Planting
- My Farms
- Crop Lifecycle
- Crop Health
- Risk Intelligence
- Alerts

AI
- AI Copilot
- Recommendations
- Farm Simulator

Intelligence
- Regional Risk Map
- Climate Intelligence
- Market Intelligence
- Analytics

Industry
- Industry Intelligence

Settings
```

Mobile priority navigation:

- Dashboard
- Crop Advisor
- Farms
- Copilot
- Alerts

## 15. Screen Implementation Plan

### Dashboard: `/dashboard`

Purpose:

- Answer what is happening, what requires attention, and what to do next.

Must include:

- User name.
- Current location.
- Current season.
- Notifications and profile access.
- Primary action: Plan a Crop / Start Crop Advisor.
- Primary action: Manage My Crop / View My Farms.
- Overall agricultural risk.
- Risk categories: Weather, Soil, Pest, Disease, Water, Market, Production.
- AI insight.
- Attention center.
- Top recommendations.
- Data freshness.

### Crop Advisor: `/crop-advisor`

Purpose:

- Core before-planting decision module.

Inputs:

- Farm.
- Location.
- Area.
- Latitude and longitude.
- Soil type.
- Soil pH.
- Nitrogen.
- Phosphorus.
- Potassium.
- Organic matter.
- Moisture.
- Salinity.
- Irrigation availability.
- Irrigation type.
- Water availability.
- Season.
- Expected planting date.
- Known crop choice or "Recommend crops for me."

Outputs:

- Ranked crop recommendations.
- Crop Decision Score.
- Suitability score.
- Risk score.
- Market score.
- Expected yield.
- Estimated revenue.
- Production cost.
- Estimated profit.
- Risk-adjusted profit.
- Confidence.
- Explanation.

### Crop Detail: `/crop-advisor/[crop]`

Purpose:

- Explain why a crop is or is not a good choice.

Must include:

- Suitability.
- Risk.
- Climate score.
- Soil score.
- Market score.
- Production score.
- Water requirement.
- Expected yield.
- Economic estimate.
- AI crop explanation.
- "Why not this crop?" analysis.
- CTA to select crop and create crop cycle.

### Crop Comparison: `/crop-advisor/compare`

Purpose:

- Compare crop options objectively.

Compare:

- Decision score.
- Risk.
- Soil suitability.
- Climate suitability.
- Water requirement.
- Market outlook.
- Expected yield.
- Estimated return.
- Risk-adjusted profit.

### Farms: `/farms`

Purpose:

- Manage land and crop cycles.

Must support:

- Create farm.
- Edit farm.
- Delete farm.
- View farm.
- Add crop.
- View previous crop cycles.

Farm fields:

- Farm name.
- Location.
- Area.
- Soil type.
- Soil pH.
- Irrigation type.
- Water availability.
- Latitude.
- Longitude.

### Farm Detail: `/farms/[farmId]`

Purpose:

- Show the farm as a decision context.

Must include:

- Farm profile.
- Soil and water details.
- Active crop cycle.
- Previous crop cycles.
- Farm-level recommendations.
- Regional risk context.
- CTA to run Crop Advisor.
- CTA to open active crop cycle.

### Crop Cycle Detail: `/farms/[farmId]/crops/[cropCycleId]`

Purpose:

- Core after-planting management page.

Must include:

- Crop name.
- Season.
- Sowing date.
- Crop age.
- Current growth stage.
- Crop Health Score.
- Dynamic Crop Risk Score.
- Risk breakdown: Weather, Water, Pest, Disease, Soil, Market, Production.
- Risk factors.
- Growth-stage intelligence.
- Crop management recommendations.
- Observations.
- Timeline.
- Alerts.
- Simulator CTA.
- Copilot CTA.

### Risk Intelligence: `/risk`

Purpose:

- Cross-farm and crop-cycle risk analysis.

Must include:

- Current crop risk.
- Overall agricultural risk.
- Category breakdown.
- Trend.
- Risk factor contribution chart.
- Confidence.
- Historical comparison.
- Recommended actions.

### AI Copilot: `/copilot`

Purpose:

- Conversational intelligence layer.

Must understand:

- User.
- Farm.
- Crop.
- Crop age.
- Growth stage.
- Location.
- Soil.
- Weather.
- Risk.
- Previous recommendations.
- Previous observations.

Response structure:

- Answer.
- Reasoning.
- Relevant data.
- Confidence.
- Recommended action.
- Sources or data freshness.

MVP implementation:

- Start with mock-grounded responses.
- Route through `CopilotService`.
- Later replace with LLM + RAG + tool calling.

### Recommendations: `/recommendations`

Purpose:

- Convert risk and crop-stage context into actions.

Must include:

- Irrigation recommendations.
- Nutrient recommendations.
- Pest monitoring recommendations.
- Disease monitoring recommendations.
- Weather recommendations.
- Market recommendations.
- Priority.
- Estimated cost.
- Expected risk reduction.
- Expected benefit.
- Confidence.

### Farm Simulator: `/simulator`

Purpose:

- What-if decision support.

Inputs:

- Rainfall change.
- Temperature change.
- Humidity change.
- Irrigation change.
- Fertilizer change.
- Pest pressure change.

Outputs:

- Baseline risk.
- Simulated risk.
- Baseline yield.
- Simulated yield.
- Estimated revenue.
- Estimated loss.
- Explanation.
- Recommended intervention.

### Regional Risk Map: `/risk-map`

Purpose:

- Show agricultural risk at district, state, and national level.

Must include:

- India map.
- State risk.
- District risk.
- Risk trends.
- Regional detail.
- Affected crops.
- Risk drivers.
- Forecast.
- Recommended interventions.

MVP simplification:

- Use state-level markers first.
- Use district-level data for Tamil Nadu in mock data.
- Add full GeoJSON later.

### Alerts: `/alerts`

Purpose:

- Early warning system.

Alert types:

- Drought.
- Flood.
- Pest.
- Disease.
- Heat.
- Market.
- Crop stress.

Must include:

- Severity.
- Title.
- Description.
- Farm or crop cycle link.
- Region link.
- Status.
- Expected timeframe.
- Recommended action.

## 16. P1 Screen Plan

### Crop Image Intelligence

- Upload crop image.
- Show possible disease, pest, or stress.
- Show confidence.
- Show risk assessment.
- Show recommended action.
- Clearly state it is decision support, not diagnosis.

### Climate Intelligence

- Temperature anomalies.
- Rainfall anomalies.
- Drought risk.
- Flood risk.
- Heat stress.
- Climate scenario analysis.

### Market Intelligence

- Commodity prices.
- Historical prices.
- Market trends.
- Volatility.
- Demand indicators.
- Market outlook.

### Analytics

- Crop comparison.
- Risk trends.
- Yield trends.
- Regional comparison.
- Market trends.

### Industry Intelligence

- Insurance exposure.
- Lending risk.
- Government district monitoring.
- Agribusiness supply risk.

## 17. Mock Data Strategy

Mock data should demonstrate the full v2 journey.

Recommended demo data:

- Farmer: Varun.
- Location: Thanjavur, Tamil Nadu.
- Farm: 5 acres.
- Soil: clay loam, pH 6.8, good organic matter.
- Water: canal irrigation, moderate availability.
- Season: Kharif 2026.
- Crop Advisor ranking: Rice 88, Groundnut 81, Maize 74, Cotton 63.
- Rice risk: LOW before planting.
- Rice expected yield: 4.8 t/ha.
- Rice estimated profit: Rs 44K/acre.
- Crop cycle: Rice - Kharif 2026.
- Sowing date: July 10, 2026.
- Crop age: 45 days.
- Growth stage: Vegetative.
- Crop health: 76 GOOD.
- Crop risk: 64 HIGH.
- Risk drivers: rainfall deficit, temperature anomaly, soil moisture deficit, pest conditions.
- Simulation: rainfall -20 percent and temperature +2 C changes risk 64 to 79.
- Yield changes 4.3 to 3.6 t/ha.
- Potential loss: Rs 14,000.
- Alert: drought risk escalation in 10-14 days.
- Regional map: same pattern visible at farm, district, state, India level.

## 18. API Contract Plan

Build API routes around stable contracts even if responses are mock-backed first:

```text
GET /api/farms
POST /api/farms
GET /api/farms/:farmId
PATCH /api/farms/:farmId
DELETE /api/farms/:farmId
POST /api/crop-advisor
POST /api/crop-advisor/compare
GET /api/crop-advisor/:crop
GET /api/crop-cycles
POST /api/crop-cycles
GET /api/crop-cycles/:cropCycleId
PATCH /api/crop-cycles/:cropCycleId
GET /api/crop-cycles/:cropCycleId/health
GET /api/crop-cycles/:cropCycleId/risk
GET /api/recommendations
POST /api/recommendations/analyze
POST /api/simulate
POST /api/copilot
GET /api/copilot/conversations
GET /api/risk/regions
GET /api/alerts
PATCH /api/alerts/:alertId
```

API requirements:

- Validate request bodies with Zod.
- Return typed responses.
- Include confidence and freshness where applicable.
- Return useful error messages.
- Keep all secret-backed calls server-side.

## 19. ML Integration Contracts

The UI should consume stable response contracts.

Crop recommendation output:

```json
{
  "crop": "rice",
  "decision_score": 88,
  "risk_score": 31,
  "confidence": 0.89,
  "expected_yield": 4.8,
  "market_score": 84,
  "climate_score": 91,
  "soil_score": 87
}
```

Crop risk output:

```json
{
  "overall_score": 64,
  "risk_level": "HIGH",
  "confidence": 0.86,
  "categories": {
    "weather": 71,
    "water": 67,
    "pest": 54,
    "disease": 41,
    "soil": 48,
    "market": 52,
    "production": 61
  }
}
```

Yield prediction output:

```json
{
  "expected_yield": 4.3,
  "unit": "tons_per_hectare",
  "confidence": 0.81
}
```

## 20. Scoring Strategy

Risk thresholds should be configurable:

```text
0-29     LOW
30-49    MODERATE
50-69    HIGH
70-100   CRITICAL
```

Do not hard-code thresholds inside UI components.

Crop Decision Score should initially use configurable weights:

```text
Soil Suitability          20%
Climate Suitability       20%
Water Compatibility       15%
Weather Risk              10%
Market Potential          15%
Production Potential      10%
Economic Return           10%
```

Implementation:

- Store thresholds and score weights in `src/lib/scoring`.
- Use mock scoring logic first.
- Return explanation metadata for every score.
- Replace the scoring internals later with ML outputs while preserving response shape.

## 21. UI And UX Direction

The product should feel:

- Professional.
- Modern.
- Trustworthy.
- Intelligent.
- Agricultural.
- Enterprise-grade.

Avoid:

- Generic student-dashboard layout.
- Raw scores without explanation.
- Excessive gradients.
- Glassmorphism.
- Decorative animations.
- Unnecessary charts.
- Overloaded dashboards.

Required UI patterns:

- Clear primary actions on dashboard.
- Strong distinction between before-planting and after-planting journeys.
- Consistent risk status indicators.
- Cards for focused information, not clutter.
- Charts only where they explain a decision.
- Data freshness labels.
- Confidence labels.
- Loading skeletons.
- Empty states.
- Retryable error states.
- AI unavailable fallback.

## 22. AI Trust And Safety

AI outputs must:

- Distinguish observations from predictions.
- Avoid unsupported claims.
- Reference application data.
- Show confidence where available.
- Avoid pretending to know unavailable information.
- Recommend professional verification for high-impact decisions.

Use trust language where needed:

```text
This is decision support based on available data, not a guaranteed diagnosis or legally binding agricultural advice.
```

## 23. Responsive Design

Desktop is the primary experience.

Tablet should remain fully functional.

Mobile must support:

- Crop Advisor.
- Farm pages.
- Crop cycle risk.
- Copilot.
- Alerts.
- Recommendations.

Maps and analytics should remain usable through simplified responsive layouts.

## 24. Error, Loading, And Empty States

Every major data-driven component should support:

- Loading skeleton.
- Empty state.
- Error state.

Examples:

```text
No farms added yet.
Add Your First Farm
```

```text
Unable to load farm data.
Retry
```

```text
AI Copilot is temporarily unavailable. Your latest farm risk information is still available.
```

## 25. Implementation Phases

### Phase 0: Review And Approval

- Review this updated plan.
- Confirm that the v2 PRD is the source of truth.
- Confirm that implementation should start after approval.

### Phase 1: Foundation

- Scaffold Next.js TypeScript app.
- Configure Tailwind CSS.
- Configure shadcn/ui.
- Add Lucide, Recharts, Leaflet.
- Create `.env.local`, `.env.example`, and `.gitignore`.
- Add env validation.
- Add Supabase client structure.
- Add base app shell.

### Phase 2: Supabase Auth And Schema

- Add login, signup, reset password, and sign-out.
- Add Google OAuth flow.
- Add protected route middleware.
- Create migrations for P0 tables.
- Add RLS policies.
- Add profile creation flow.

### Phase 3: Domain Types And Mock Intelligence

- Define farm, crop, crop cycle, risk, health, recommendation, simulation, alert, and region types.
- Add configurable score thresholds and crop decision weights.
- Add mock demo story data.
- Implement mock services behind interfaces.
- Add API routes returning typed mock responses.

### Phase 4: Dashboard

- Build `/dashboard`.
- Add before-planting and after-planting primary actions.
- Add risk overview, attention center, AI insight, recommendations, and freshness.

### Phase 5: Farm Foundation

- Build `/farms`.
- Build `/farms/[farmId]`.
- Add farm CRUD.
- Capture soil, water, and location data.
- Add active and previous crop cycles.

### Phase 6: Before-Planting Intelligence

- Build `/crop-advisor`.
- Build `/crop-advisor/[crop]`.
- Build `/crop-advisor/compare`.
- Add Crop Decision Score.
- Add suitability, risk, market, yield, and economic estimates.
- Add "Why recommended?" and "Why not?" explanations.
- Add select-crop flow that creates a crop cycle.

### Phase 7: After-Planting Intelligence

- Build `/farms/[farmId]/crops/[cropCycleId]`.
- Add growth stage tracking.
- Add Crop Health Score.
- Add Dynamic Crop Risk Score.
- Add risk factor explanations.
- Add crop-stage recommendations.
- Add observations and timeline.

### Phase 8: Copilot, Recommendations, Simulator

- Build `/copilot`.
- Build `/recommendations`.
- Build `/simulator`.
- Ensure all features share farm and crop-cycle context.
- Add mock-grounded AI responses.
- Add intervention comparison and cost-benefit view.

### Phase 9: Regional Intelligence And Alerts

- Build `/risk-map`.
- Build `/alerts`.
- Add India/state/district mock data.
- Connect alerts to farms, crop cycles, and regional risk.

### Phase 10: P1 Lightweight Pages

- Add lightweight Climate Intelligence.
- Add lightweight Market Intelligence.
- Add lightweight Analytics.
- Add lightweight Industry Intelligence.
- Leave Crop Image Intelligence as a planned feature unless time allows secure upload handling.

### Phase 11: Validation And Demo Polish

- Run lint and build.
- Verify protected routes.
- Verify no secrets are committed.
- Test the demo story from Crop Advisor to Alerts.
- Check responsive views.
- Check loading, empty, and error states.

## 26. Recommended Implementation Order

Best order for this PRD:

1. Foundation and env files.
2. Supabase auth, profile, farm schema, and RLS.
3. Domain types and mock intelligence contracts.
4. Dashboard with the two primary journeys.
5. Farm CRUD.
6. Crop Advisor and Crop Comparison.
7. Crop cycle creation.
8. Crop cycle health and risk.
9. Copilot, recommendations, and simulator.
10. Regional map and alerts.
11. P1 pages and polish.

This order is better than building a generic dashboard first because the v2 PRD's core differentiator is the before-planting plus after-planting lifecycle.

## 27. Ideas To Strengthen The Build

### Guided Demo Mode

Add a small demo progress strip:

```text
Land -> Crop Advisor -> Select Crop -> Crop Cycle -> Risk -> Copilot -> Simulator -> Alert
```

### Crop Decision Breakdown

Show the weighted contribution behind each crop score:

- Soil.
- Climate.
- Water.
- Market.
- Yield.
- Economics.
- Risk.

### Why Not Analysis

For every non-selected crop, show the main reason it ranked lower.

### Growth Stage Recommendations

Tie every action to the crop stage, such as vegetative, flowering, grain filling, or harvest.

### Evidence Tags

Attach tags to claims:

- Soil.
- Weather.
- Market.
- Forecast.
- Historical.
- AI estimate.

### Decision Confidence

Break confidence into:

- Data completeness.
- Forecast certainty.
- Historical similarity.
- Model certainty.

### Risk-Adjusted Profit

Show not only profit, but profit after risk adjustment.

### Intervention Benefit Score

Rank actions by:

- Cost.
- Expected risk reduction.
- Expected benefit.
- Time to impact.
- Practical difficulty.

## 28. Open Decisions For Review

1. Should the first implementation use real Supabase auth immediately, or prepare auth screens and run mock-first until keys are provided?
2. Should the demo focus specifically on Thanjavur, Tamil Nadu, and Rice for the main story?
3. Should Crop Advisor be the first completed business feature after auth and farm setup?
4. Should AI Copilot start as mock-grounded responses, then switch to real LLM after `OPENAI_API_KEY` is available?
5. Should P1 pages be built as lightweight placeholders or skipped until the P0 journey is polished?

## 29. Recommended Decision

Use the updated PRD v2.0 as the source of truth and build the MVP around the farmer journey:

```text
Create Farm -> Ask What To Grow -> Compare Crops -> Select Crop -> Track Crop Cycle -> Monitor Risk -> Ask Copilot -> Simulate -> Act On Recommendations -> Watch Alerts
```

This implementation path best matches the product positioning:

```text
Before you plant, help you choose.
After you plant, help you manage.
```


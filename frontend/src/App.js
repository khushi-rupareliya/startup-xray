import { Sun, Moon } from "lucide-react";

import React, { useState } from "react";
import "./style.css";

function App() {
  const [step, setStep] = useState(1);
  const [darkMode, setDarkMode] = useState(true);

  const [idea, setIdea] = useState("");
  const [analysis, setAnalysis] = useState(null); 

  const [result, setResult] = useState(0);

/* Startup Basics */
const [startupStage, setStartupStage] = useState("Idea");
const [productReadiness, setProductReadiness] = useState("Concept");
const [marketSize, setMarketSize] = useState("Medium");
const [marketGrowth, setMarketGrowth] = useState("Medium");

/* Business Strength */
const [usp, setUsp] = useState("Yes");
const [businessModel, setBusinessModel] = useState("Clear");
const [revenueModel, setRevenueModel] = useState("Yes");
const [customerValidation, setCustomerValidation] = useState("No users");

/* Execution Power */
const [teamSize, setTeamSize] = useState("");
const [founderExperience, setFounderExperience] = useState("First-time");
const [teamSkills, setTeamSkills] = useState("Limited");

/* Financial & Market Signals */
const [fundingAmount, setFundingAmount] = useState("");
const [fundingStage, setFundingStage] = useState("Bootstrapped");
const [investorQuality, setInvestorQuality] = useState("Low");
const [competition, setCompetition] = useState("Medium");

const [industry, setIndustry] = useState("");

 async function handleSubmit() {
  try {
    const data = {
      fundingStage,
      investorQuality,
      competition
    };

    const res = await fetch("https://startup-xray.onrender.com/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const response = await res.json();

    const prob = (response.probability * 100).toFixed(1);
    setResult(Number(prob));
    setStep(4);

  } catch (err) {
    console.error("Error:", err);
  }
}
  const handleAnalyzeIdea = async () => {
    console.log("Button clicked");
  try {
    const res = await fetch("http://127.0.0.1:5000/analyze-idea", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idea })
    });

    const data = await res.json();
    setAnalysis(data);

  } catch (err) {
    console.error(err);
  }
};

const finalReport = {
  overview: {
    industry: "EdTech (Education Technology)",
    industryInsight:
      "Focused on leveraging technology to improve career decision-making and guidance for students.",

    targetSegment: "Students and early-career learners",
    targetInsight:
      "Targets students who are uncertain about career paths and need structured guidance, assessments, and insights.",

    opportunityArea: "High-growth career guidance and EdTech segment",
    opportunityInsight:
      "Rising awareness around career planning, combined with digital adoption in education, creates strong growth potential.",

    keyConcern: "Highly competitive and fragmented market",
    concernInsight:
      "Presence of existing platforms means differentiation through personalization is critical."
  },

  success: {
    percentage: 78,
    confidence: "High",
    drivers: [
      "Large demand for structured career guidance",
      "Digital adoption supports scalability",
      "Balanced team improves execution",
      "Competition introduces moderate risk"
    ]
  },

  scores: {
    ideaStrength: { score: 7, label: "Strong" },
    marketPotential: { score: 8.5, label: "High" },
    businessViability: { score: 6.5, label: "Moderate" },
    executionCapability: { score: 7.5, label: "Strong" },
    financialStrength: { score: 6, label: "Moderate" }
  },

  insights: [
    "Strong demand for career guidance platforms",
    "High EdTech growth supports scalability",
    "Balanced execution improves efficiency"
  ],

  risks: [
    "High competition in EdTech",
    "Moderate funding limits expansion",
    "Differentiation is critical"
  ],

  recommendation:
    "Strong potential. Focus on differentiation and financial strength to improve success chances."
};

return (
  <div className={darkMode ? "app dark" : "app light"}>

    {/* HEADER */}
    <div className="header">
      <h1 style={{ fontWeight: "700" }}>Startup X-Ray</h1>

      <button className="icon-btn" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>

    {/* 🔥 PROGRESS BAR */}
    <div className="top-bar">

      {/* PROGRESS LINE */}
      <div className="progress-line">
        <div
          className="progress-fill"
          style={{ width: `${((step - 1) / 5) * 100}%` }}
        ></div>
      </div>

      {/* STEPS */}
      <div className="steps">
        <span className={step === 1 ? "active" : ""}>Describe Idea</span>
        <span className={step === 2 ? "active" : ""}>Startup Basics</span>
        <span className={step === 3 ? "active" : ""}>Business Strength</span>
        <span className={step === 4 ? "active" : ""}>Execution Power</span>
        <span className={step === 5 ? "active" : ""}>Financial & Market Signals</span>
        <span className={step === 6 ? "active" : ""}>Result Dashboard</span>
      </div>

    </div>

    {/* CONTENT */}
    <div className="content">
      
      {/* STEP 1 */}
      {step === 1 && (
  <div className="step-container">

    {/* LEFT SIDE (INPUT) */}
     <div className="left card">
      <h2>Step 1: Describe Your Startup Idea</h2>

      <p className="helper">
        Briefly describe your startup concept.
      </p>

<textarea
  value={idea}
  onChange={(e) => {
    setIdea(e.target.value);
    setAnalysis(null); // reset analysis when user edits
  }}
  placeholder="eg.AI platform for student productivity"
/>

      <div className="buttons">
        <button className="back" disabled>← Back</button>
        <button 
          onClick={handleAnalyzeIdea}
          disabled={!idea.trim()}
       >
        Analyze Idea
        </button>

        <button 
          onClick={() => setStep(2)} 
          disabled={!analysis || !idea.trim()}
        >
          Next →
        </button>
      </div>
    </div>

{/* RIGHT SIDE (OUTPUT) */}
<div className="right card">
  <h3>QUICK ANALYSIS</h3>

  <div className="analysis-box">
    {analysis ? (
      <div>
        <p><b>Industry:</b> {analysis.industry}</p>
        <p><b>Problem:</b> {analysis.problem}</p>
        <p><b>Solution:</b> {analysis.solution}</p>
        <p><b>Insight:</b> {analysis.insight}</p>
        <p><b>Summary:</b> {analysis.summary}</p>
      </div>
    ) : (
      <p className="placeholder">
        Your AI analysis will appear here...
      </p>
    )}
  </div>
</div>
</div>
)}

{step === 2 && (
<div className="panel card">

    <h2>Step 2: Startup Basics</h2>

    <p className="helper">
      Provide basic details about your startup.
    </p>

    {/* 🔹 STARTUP PROFILE */}
    <div className="form-section">
      <h4>Startup Profile</h4>

      <label>Industry</label>
      <input
        value={industry || analysis?.industry || ""}
        onChange={(e) => setIndustry(e.target.value)}
        placeholder="e.g. EdTech, AI"
      />

      <label>Startup Stage</label>
      <select
        value={startupStage}
        onChange={(e) => setStartupStage(e.target.value)}
      >
        <option>Idea</option>
        <option>MVP</option>
        <option>Revenue</option>
        <option>Scaling</option>
      </select>

      <label>Product Readiness</label>
      <select
        value={productReadiness}
        onChange={(e) => setProductReadiness(e.target.value)}
      >
        <option>Concept</option>
        <option>Prototype</option>
        <option>Live Product</option>
      </select>
    </div>

    {/* 🔹 MARKET INSIGHTS */}
    <div className="form-section">
      <h4>Market Insights</h4>

      <p className="hint">
        Helps us estimate market opportunity
      </p>

      <label>Market Size</label>
      <select
        value={marketSize}
        onChange={(e) => setMarketSize(e.target.value)}
      >
        <option>Small</option>
        <option>Medium</option>
        <option>Large</option>
      </select>

      <label>Market Growth Rate</label>
      <select
        value={marketGrowth}
        onChange={(e) => setMarketGrowth(e.target.value)}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
    </div>

    {/* BUTTONS */}
    <div className="buttons">
      <button className="back" onClick={() => setStep(1)}>
        Back
      </button>

      <button
        onClick={() => setStep(3)}
        disabled={!industry || !marketSize || !marketGrowth}
      >
        Next →
      </button>
    </div>

  </div>
)}

{/* STEP - 3 */}
{step === 3 && (
  <div className="panel card">

    <h2>Step 3: Business Strength</h2>

    <p className="helper">
      Tell us about your business foundation and validation.
    </p>

    {/* 🔹 BUSINESS FOUNDATION */}
    <div className="form-section">
      <h4>Business Foundation</h4>

      <label>USP Defined</label>
      <select
        value={usp}
        onChange={(e) => setUsp(e.target.value)}
      >
        <option>Yes</option>
        <option>No</option>
      </select>

      <label>Business Model Clarity</label>
      <select
        value={businessModel}
        onChange={(e) => setBusinessModel(e.target.value)}
      >
        <option>Clear</option>
        <option>Partial</option>
        <option>Undefined</option>
      </select>

      <label>Revenue Model</label>
      <select
        value={revenueModel}
        onChange={(e) => setRevenueModel(e.target.value)}
      >
        <option>Yes</option>
        <option>No</option>
      </select>
    </div>

    {/* 🔹 VALIDATION & TRACTION */}
    <div className="form-section">
      <h4>Validation & Traction</h4>

      <p className="hint">
        Helps us understand real-world validation
      </p>

      <label>Customer Validation</label>
      <select
        value={customerValidation}
        onChange={(e) => setCustomerValidation(e.target.value)}
      >
        <option>No users</option>
        <option>Early users</option>
        <option>Paying customers</option>
      </select>
    </div>

    {/* BUTTONS */}
    <div className="buttons">
      <button className="back" onClick={() => setStep(2)}>
        Back
      </button>

      <button
        onClick={() => setStep(4)}
        disabled={!usp || !businessModel || !customerValidation}
      >
        Next →
      </button>
    </div>

  </div>
)}

{/* STEP 4 */}
 {step === 4 && (
  <div className="panel card">

    <h2>Step 4: Execution Power</h2>

    <p className="helper">
      Tell us about your team and execution capability.
    </p>

    {/* 🔹 TEAM STRUCTURE */}
    <div className="form-section">
      <h4>Team Structure</h4>

      <label>Team Size</label>
      <input
        type="number"
        value={teamSize}
        onChange={(e) => setTeamSize(e.target.value)}
        placeholder="e.g. 5"
      />

      <label>Founder Experience</label>
      <select
        value={founderExperience}
        onChange={(e) => setFounderExperience(e.target.value)}
      >
        <option>First-time</option>
        <option>Experienced</option>
      </select>
    </div>

    {/* 🔹 TEAM CAPABILITY */}
    <div className="form-section">
      <h4>Team Capability</h4>

      <p className="hint">
        Helps evaluate execution strength
      </p>

      <label>Team Skill Coverage</label>
      <select
        value={teamSkills}
        onChange={(e) => setTeamSkills(e.target.value)}
      >
        <option>Limited</option>
        <option>Balanced</option>
        <option>Strong</option>
      </select>
    </div>

    {/* BUTTONS */}
    <div className="buttons">
      <button className="back" onClick={() => setStep(3)}>
        Back
      </button>

      <button
        onClick={() => setStep(5)}
        disabled={!teamSize || !founderExperience || !teamSkills}
      >
        Next →
      </button>
    </div>

  </div>
)}


{/* STEP 5 */}
{step === 5 && (
  <div className="panel card">

    <h2>Step 5: Financial & Market Signals</h2>

    <p className="helper">
      Provide financial strength and market competitiveness details.
    </p>

    {/* 🔹 FINANCIAL STRENGTH */}
    <div className="form-section">
      <h4>Financial Strength</h4>

      <label>Funding Amount ($)</label>
      <input
        type="number"
        value={fundingAmount}
        onChange={(e) => setFundingAmount(e.target.value)}
        placeholder="e.g. 500000"
      />

      <label>Funding Stage</label>
      <select
        value={fundingStage}
        onChange={(e) => setFundingStage(e.target.value)}
      >
        <option>Bootstrapped</option>
        <option>Seed</option>
        <option>Series A+</option>
      </select>

      <label>Investor Quality</label>
      <select
        value={investorQuality}
        onChange={(e) => setInvestorQuality(e.target.value)}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
    </div>

    {/* 🔹 MARKET COMPETITION */}
    <div className="form-section">
      <h4>Market Competition</h4>

      <p className="hint">
        Helps assess competitive pressure and risk
      </p>

      <label>Competition Level</label>
      <select
        value={competition}
        onChange={(e) => setCompetition(e.target.value)}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
    </div>

    {/* BUTTONS */}
    <div className="buttons">
      <button className="back" onClick={() => setStep(4)}>
        Back
      </button>

      <button
        onClick={() => setStep(6)}
        disabled={!fundingAmount || !fundingStage || !competition}
      >
        Next →
      </button>
    </div>

  </div>
)}


{/* STEP 6 */}
{step === 6 && (
  <div className="panel">

    {/* 🔥 SUCCESS */}
    <div className="result-top">
      <h2>Startup Success Probability</h2>

      <div className="score-circle">
        {finalReport.success.percentage}%
      </div>

      <p className="confidence">
        Confidence: {finalReport.success.confidence}
      </p>
    </div>

    {/* 🔹 OVERVIEW */}
    <div className="form-section">
      <h4>Startup Overview</h4>

      <p><b>Industry:</b> {finalReport.overview.industry}</p>
      <p>{finalReport.overview.industryInsight}</p>

      <p><b>Target:</b> {finalReport.overview.targetSegment}</p>
      <p>{finalReport.overview.targetInsight}</p>

      <p><b>Opportunity:</b> {finalReport.overview.opportunityArea}</p>
      <p>{finalReport.overview.opportunityInsight}</p>

      <p><b>Concern:</b> {finalReport.overview.keyConcern}</p>
      <p>{finalReport.overview.concernInsight}</p>
    </div>

    {/* 🔹 SCORES */}
    <div className="form-section">
      <h4>Key Scores</h4>

      <ul className="score-list">
        <li>Idea Strength: {finalReport.scores.ideaStrength.score} ({finalReport.scores.ideaStrength.label})</li>
        <li>Market Potential: {finalReport.scores.marketPotential.score} ({finalReport.scores.marketPotential.label})</li>
        <li>Business Viability: {finalReport.scores.businessViability.score} ({finalReport.scores.businessViability.label})</li>
        <li>Execution Capability: {finalReport.scores.executionCapability.score} ({finalReport.scores.executionCapability.label})</li>
        <li>Financial Strength: {finalReport.scores.financialStrength.score} ({finalReport.scores.financialStrength.label})</li>
      </ul>
    </div>

    {/* 🔹 INSIGHTS */}
    <div className="form-section">
      <h4>Key Insights</h4>
      <ul>
        {finalReport.insights.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>

    {/* 🔹 RISKS */}
    <div className="form-section">
      <h4>Risks</h4>
      <ul>
        {finalReport.risks.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>

    {/* 🔹 RECOMMENDATION */}
    <div className="form-section">
      <h4>Final Recommendation</h4>
      <p>{finalReport.recommendation}</p>
    </div>

    <div className="buttons">
      <button onClick={() => setStep(1)}>Start Over</button>
    </div>

  </div>
)}



    </div>
  </div>
  );
}

export default App;

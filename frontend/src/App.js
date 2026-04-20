import { Sun, Moon } from "lucide-react";
import React, { useState, useEffect } from "react";
import "./style.css";


const demoAnalyses = [
  {
    industry: "EdTech",
    problem:
      "Students often struggle with maintaining focus, managing time effectively, and organizing their study schedules, leading to reduced productivity and inconsistent learning outcomes.",
    solution:
      "A structured digital learning platform that helps students plan study sessions, track progress, and stay focused through guided workflows and productivity tools.",
    insight:
      "With the rapid shift toward online education and self-learning, there is a growing demand for tools that enhance student productivity and learning efficiency.",
    summary:
      "This idea focuses on improving student productivity by combining structured learning techniques with digital tools, making it easier for users to stay consistent and achieve better academic results."
  },
  {
    industry: "HealthTech",
    problem:
      "Many individuals lack easy access to continuous health monitoring and preventive care tools, making it difficult to track their daily wellness and detect early health issues.",
    solution:
      "A digital health platform that enables users to monitor key health metrics, receive insights, and maintain better lifestyle habits through simple and accessible tools.",
    insight:
      "The increasing awareness of preventive healthcare and wearable technology is driving demand for accessible health tracking and monitoring solutions.",
    summary:
      "This concept aims to empower individuals to take control of their health by providing accessible monitoring tools and actionable insights for better long-term wellness."
  },
  {
    industry: "FinTech",
    problem:
      "Young individuals often lack financial literacy and struggle with managing money, savings, and investments effectively, leading to poor financial decisions.",
    solution:
      "A gamified financial platform that educates users about money management, budgeting, and investing through interactive and engaging experiences.",
    insight:
      "The rise of digital finance platforms and increasing interest in personal finance among younger audiences create strong opportunities for educational fintech solutions.",
    summary:
      "This idea focuses on simplifying financial learning through gamification, helping users build better money habits and improve their financial decision-making over time."
  },
  {
    industry: "E-commerce",
    problem:
      "Small sellers and independent businesses often face challenges in establishing an online presence and reaching a wider customer base in a competitive market.",
    solution:
      "A user-friendly platform that allows sellers to easily create digital storefronts while helping customers discover products through curated and personalized experiences.",
    insight:
      "The continuous growth of online shopping and digital marketplaces highlights the need for platforms that support small businesses and improve product discoverability.",
    summary:
      "This concept aims to bridge the gap between small sellers and online consumers by simplifying digital selling and enhancing the overall shopping experience."
  },
  {
    industry: "AI SaaS",
    problem:
      "Businesses often rely on repetitive manual processes and inefficient workflows, which reduce productivity and increase operational costs.",
    solution:
      "An AI-powered platform that automates routine tasks, streamlines workflows, and improves efficiency across different business operations.",
    insight:
      "The rapid adoption of artificial intelligence in business environments is driving demand for automation tools that enhance productivity and reduce manual effort.",
    summary:
      "This idea focuses on leveraging AI to optimize business operations, enabling organizations to save time, reduce costs, and scale more efficiently."
  },
  {
    industry: "Social Impact",
    problem:
      "A large number of students and communities lack access to affordable and quality education resources, limiting their opportunities for growth and development.",
    solution:
      "A low-cost or accessible digital platform that provides educational content and learning resources to underserved populations.",
    insight:
      "Growing support from governments, NGOs, and investors is creating opportunities for scalable solutions that address education accessibility challenges.",
    summary:
      "This concept is centered on improving access to education by delivering affordable and scalable learning solutions to communities in need."
  }
];

const demoScores = [0.42, 0.55, 0.63, 0.71, 0.78, 0.84];



function useTypewriter(text, speed = 15) {
  const [output, setOutput] = useState("");

  useEffect(() => {
    let i = 0;
    setOutput("");
    const interval = setInterval(() => {
      setOutput(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text]);

  return output;
}

function useStreamingAnalysis(analysis) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    if (!analysis) return;

    const lines = [
      { label: "Industry", value: analysis.industry },
      { label: "Problem", value: analysis.problem },
      { label: "Solution", value: analysis.solution },
      { label: "Insight", value: analysis.insight },
      { label: "Summary", value: analysis.summary },
    ];

    setVisible([]);
    let i = 0;

    const interval = setInterval(() => {
      if (lines[i]) {
        setVisible((prev) => [...prev, lines[i]]);
      }
      i++;
      if (i >= lines.length) clearInterval(interval);
    }, 500);

    return () => clearInterval(interval);
  }, [analysis]);

  return visible;
}


function buildDynamicReport(inputs, mlScore) {
  const {
    idea, industry, startupStage, productReadiness,
    marketSize, marketGrowth, usp, businessModel, revenueModel,
    customerValidation, teamSize, founderExperience, teamSkills,
    fundingAmount, fundingStage, investorQuality, competition,
  } = inputs;

  const pct = Math.round(mlScore * 100);
  const confidence = pct >= 70 ? "High" : pct >= 45 ? "Medium" : "Low";

  const industryLabel = industry || "Technology";
  const stageLabel    = startupStage || "Idea";

  const opportunityMap = {
    Large:  "A large addressable market with strong growth signals.",
    Medium: "A moderately sized market with room to carve a niche.",
    Small:  "A niche market — focus on deep customer value to grow.",
  };
  const concernMap = {
    High:   "High competition — clear differentiation is essential.",
    Medium: "Moderate competition — a strong USP will be your moat.",
    Low:    "Low competition — move quickly to establish market presence.",
  };

  // ── key scores ──
  const ideaScore   = usp === "Yes" ? (businessModel === "Clear" ? 8 : 6.5) : 5;
  const marketScore = marketSize === "Large" ? 9 : marketSize === "Medium" ? 7 : 5;
  const bizScore    = revenueModel === "Yes"
    ? (customerValidation === "Paying customers" ? 8.5 : customerValidation === "Early users" ? 7 : 6)
    : 4.5;
  const execScore   = teamSkills === "Strong" ? 8.5 : teamSkills === "Balanced" ? 7 : 5.5;
  const finScore    = fundingStage === "Series A+" ? 9 : fundingStage === "Seed" ? 7 : 5;

  // named "scoreLabel" so it doesn't clobber the bar's title "label" prop on spread
  const toLabel = (n) => (n >= 8 ? "Strong" : n >= 6.5 ? "Moderate" : "Weak");

  // ── insights & risks ──
const demoInsightsPool = [
  "Growing market demand supports scalability",
  "Clear value proposition strengthens positioning",
  "Market timing appears favorable",
  "Opportunity exists for differentiation",
  "Execution capability can drive growth",
  "Industry trends indicate expansion potential"
];

const demoRisksPool = [
  "Market competition may intensify",
  "Execution challenges could arise",
  "Customer acquisition may take time",
  "Revenue model needs validation",
  "Scaling may introduce complexity",
  "External factors may impact growth"
];

const insights = demoInsightsPool.sort(() => 0.5 - Math.random()).slice(0, 3);
const risks = demoRisksPool.sort(() => 0.5 - Math.random()).slice(0, 3);

  if (marketSize === "Large" || marketGrowth === "High")
    insights.push(`${marketGrowth} growth rate in the ${industryLabel} market supports scalability`);
  if (usp === "Yes")
    insights.push("Defined USP positions the startup for differentiation");
  if (customerValidation === "Paying customers")
    insights.push("Paying customers validate product-market fit");
  else if (customerValidation === "Early users")
    insights.push("Early user traction shows initial demand");
  if (teamSkills === "Strong" || teamSkills === "Balanced")
    insights.push("Team skill coverage supports strong execution");
  if (founderExperience === "Experienced")
    insights.push("Experienced founders reduce early-stage execution risk");
  if (insights.length < 2)
    insights.push(`${stageLabel} stage startups in ${industryLabel} have strong funding opportunities`);

  if (competition === "High")
    risks.push("Highly competitive market requires strong differentiation strategy");
  if (fundingStage === "Bootstrapped")
    risks.push("Limited funding may slow growth and hiring pace");
  if (customerValidation === "No users")
    risks.push("No customer validation yet — product-market fit is unproven");
  if (teamSkills === "Limited")
    risks.push("Limited team skill coverage may create execution bottlenecks");
  if (founderExperience === "First-time")
    risks.push("First-time founders face a steeper learning curve");
  if (risks.length < 2)
    risks.push("Market conditions and investor appetite can shift rapidly");

  const recMap = {
    high:   `Strong potential at ${pct}%. Double down on customer acquisition and prepare a fundraising narrative.`,
    medium: `Promising at ${pct}%. Focus on validating with real customers and sharpening your revenue model.`,
    low:    `Early signals at ${pct}%. Prioritize finding product-market fit before scaling investment.`,
  };

  return {
    overview: {
      industry:           industryLabel,
      industryInsight:    `Operating in the ${industryLabel} space at ${stageLabel} stage.`,
      targetSegment: "Broad target audience across relevant segments",
      targetInsight:      `Product readiness is at ${productReadiness} stage — focused on early validation.`,
      opportunityArea:    `${marketGrowth}-growth ${marketSize} market`,
      opportunityInsight: opportunityMap[marketSize] || opportunityMap["Medium"],
      keyConcern:         `${competition} competition level`,
      concernInsight:     concernMap[competition]   || concernMap["Medium"],
    },
    success: { percentage: pct, confidence },
    scores: {
      // ✅ key is "scoreLabel" not "label" — safe to spread next to label="Idea Strength"
      ideaStrength:        { score: ideaScore,   scoreLabel: toLabel(ideaScore)   },
      marketPotential:     { score: marketScore, scoreLabel: toLabel(marketScore) },
      businessViability:   { score: bizScore,    scoreLabel: toLabel(bizScore)    },
      executionCapability: { score: execScore,   scoreLabel: toLabel(execScore)   },
      financialStrength:   { score: finScore,    scoreLabel: toLabel(finScore)    },
    },
    insights: insights.slice(0, 3),
    risks:    risks.slice(0, 3),
    recommendation: recMap[pct >= 70 ? "high" : pct >= 45 ? "medium" : "low"],
  };
}

// ── ScoreBar ──────────────────────────────────────────────────────────────────
function ScoreBar({ label, score, scoreLabel }) {
  const pct   = (score / 10) * 100;
  const color = score >= 8 ? "#22c55e" : score >= 6.5 ? "#f59e0b" : "#ef4444";
  return (
    <div className="score-bar-row">
      <div className="score-bar-label">
        <span>{label}</span>
        <span className="score-bar-value" style={{ color }}>
          {score} <em>({scoreLabel})</em>
        </span>
      </div>
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  const [step, setStep]         = useState(1);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const [idea, setIdea]         = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [mlScore, setMlScore]   = useState(null);
  const [report, setReport]     = useState(null);

  const [industry, setIndustry]                     = useState("");
  const [startupStage, setStartupStage]             = useState("Idea");
  const [productReadiness, setProductReadiness]     = useState("Concept");
  const [marketSize, setMarketSize]                 = useState("Medium");
  const [marketGrowth, setMarketGrowth]             = useState("Medium");

  const [usp, setUsp]                               = useState("Yes");
  const [businessModel, setBusinessModel]           = useState("Clear");
  const [revenueModel, setRevenueModel]             = useState("Yes");
  const [customerValidation, setCustomerValidation] = useState("No users");

  const [teamSize, setTeamSize]                     = useState("");
  const [founderExperience, setFounderExperience]   = useState("First-time");
  const [teamSkills, setTeamSkills]                 = useState("Limited");

  const [fundingAmount, setFundingAmount]           = useState("");
  const [fundingStage, setFundingStage]             = useState("Bootstrapped");
  const [investorQuality, setInvestorQuality]       = useState("Low");
  const [competition, setCompetition]               = useState("Medium");

  const [loadingMsg, setLoadingMsg] = useState("");

  const streamedAnalysis = useStreamingAnalysis(analysis);

  useEffect(() => {
    if (analysis?.industry) setIndustry(analysis.industry);
  }, [analysis]);

const handleAnalyzeIdea = async () => {
  setLoading(true);
  setError(null);

  setTimeout(() => {
    const text = idea.toLowerCase();

    // keyword scoring
    const categories = [
      {
        index: 0,
        keywords: ["student", "study", "learning", "education"],
      },
      {
        index: 1,
        keywords: ["health", "fitness", "wellness", "medical"],
      },
      {
        index: 2,
        keywords: ["finance", "money", "investment", "bank"],
      },
      {
        index: 3,
        keywords: ["business", "shop", "seller", "store", "ecommerce"],
      },
      {
        index: 4,
        keywords: ["ai", "automation", "workflow", "machine"],
      },
      {
        index: 5,
        keywords: ["access", "affordable", "social", "impact"],
      },
    ];

    let bestMatch = 0;
    let highestScore = 0;

    categories.forEach((cat) => {
      let score = 0;

      cat.keywords.forEach((word) => {
        if (text.includes(word)) {
          score++;
        }
      });

      if (score > highestScore) {
        highestScore = score;
        bestMatch = cat.index;
      }
    });

    // fallback if no keyword matched
    const selected =
      highestScore === 0
        ? demoAnalyses[Math.floor(Math.random() * demoAnalyses.length)]
        : demoAnalyses[bestMatch];

    setAnalysis(selected);
    setLoading(false);
  }, 1200);
};



const handleSubmitAndGoToResults = async () => {
  setLoading(true);
  setError(null);

  try {
    const probability =
      demoScores[Math.floor(Math.random() * demoScores.length)];

    setMlScore(probability);

    setReport(
      buildDynamicReport(
        {
          idea,
          industry,
          startupStage,
          productReadiness,
          marketSize,
          marketGrowth,
          usp,
          businessModel,
          revenueModel,
          customerValidation,
          teamSize,
          founderExperience,
          teamSkills,
          fundingAmount,
          fundingStage,
          investorQuality,
          competition,
        },
        probability
      )
    );

    setStep(6);
  } catch (err) {
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


const summaryText =
  streamedAnalysis.find((x) => x.label === "Summary")?.value || "";

const typedSummary = useTypewriter(summaryText);

  const progressPct = `${((step - 1) / 5) * 100}%`;

  return (
    <div className={darkMode ? "app dark" : "app light"}>

      <div className="header">
        <h1 style={{ fontWeight: "700" }}>Startup X-Ray</h1>
        <button className="icon-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="top-bar">
        <div className="progress-line">
          <div className="progress-fill" style={{ width: progressPct }} />
        </div>
        <div className="steps">
          {["Describe Idea","Startup Basics","Business Strength","Execution Power","Financial & Market Signals","Result Dashboard"]
            .map((lbl, i) => (
              <span key={i} className={step === i + 1 ? "active" : ""}>{lbl}</span>
            ))}
        </div>
      </div>

      <div className="content">

{/* STEP 1 */}
{step === 1 && (
  <div className="step-container">

    {/* LEFT PANEL */}
    <div className="left card">
      <h2>Step 1: Describe Your Startup Idea</h2>
      <p className="helper">Briefly describe your startup concept.</p>

      <textarea
        style={{ fontFamily: "inherit" }}
        value={idea}
        onChange={(e) => {
          setIdea(e.target.value);
          setAnalysis(null);
        }}
        placeholder="e.g. AI platform for student productivity"
      />

      {error && <p className="error-msg">{error}</p>}

      <div className="buttons">
        <button className="back" disabled>← Back</button>

        <button
          onClick={handleAnalyzeIdea}
          disabled={!idea.trim() || loading}
        >
          {loading ? "Analyzing…" : "Analyze Idea"}
        </button>

        <button
          onClick={() => setStep(2)}
          disabled={!analysis || !idea.trim()}
        >
          Next →
        </button>
      </div>
    </div>

    {/* RIGHT PANEL */}
    <div className="right card">
      <h3>Quick Analysis</h3>

      <div className="analysis-box">

        {/* LOADING */}
        {loading && (
          <p className="placeholder">Analyzing your idea...</p>
        )}

        {/* RESULT */}
        {!loading && analysis && (
          <div className="fade-in">

            {streamedAnalysis.filter(Boolean).map((item, i) => {
              let label = item.label;

              // better labels
              if (label === "Insight") label = "Market Insight";
              if (label === "Summary") label = "Concept Overview";

              return (
                <p key={i} className="analysis-line">
                  <b>{label}:</b><br />
                  {item.label === "Summary"
                    ? typedSummary
                    : item.value}
                </p>
              );
            })}

          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !analysis && (
          <p className="placeholder">
            Your AI-powered analysis will appear here...
          </p>
        )}

      </div>
    </div>

  </div>
)}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="panel card">
            <h2>Step 2: Startup Basics</h2>
            <p className="helper">Provide basic details about your startup.</p>
            <div className="form-section">
              <h4>Startup Profile</h4>
              <label>Industry</label>
              <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. EdTech, AI" />
              <label>Startup Stage</label>
              <select value={startupStage} onChange={(e) => setStartupStage(e.target.value)}>
                <option>Idea</option><option>MVP</option><option>Revenue</option><option>Scaling</option>
              </select>
              <label>Product Readiness</label>
              <select value={productReadiness} onChange={(e) => setProductReadiness(e.target.value)}>
                <option>Concept</option><option>Prototype</option><option>Live Product</option>
              </select>
            </div>
            <div className="form-section">
              <h4>Market Insights</h4>
              <p className="hint">Helps us estimate market opportunity</p>
              <label>Market Size</label>
              <select value={marketSize} onChange={(e) => setMarketSize(e.target.value)}>
                <option>Small</option><option>Medium</option><option>Large</option>
              </select>
              <label>Market Growth Rate</label>
              <select value={marketGrowth} onChange={(e) => setMarketGrowth(e.target.value)}>
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>
            <div className="buttons">
              <button className="back" onClick={() => setStep(1)}>Back</button>
              <button onClick={() => setStep(3)} disabled={!industry}>Next →</button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="panel card">
            <h2>Step 3: Business Strength</h2>
            <p className="helper">Tell us about your business foundation and validation.</p>
            <div className="form-section">
              <h4>Business Foundation</h4>
              <label>USP Defined</label>
              <select value={usp} onChange={(e) => setUsp(e.target.value)}>
                <option>Yes</option><option>No</option>
              </select>
              <label>Business Model Clarity</label>
              <select value={businessModel} onChange={(e) => setBusinessModel(e.target.value)}>
                <option>Clear</option><option>Partial</option><option>Undefined</option>
              </select>
              <label>Revenue Model</label>
              <select value={revenueModel} onChange={(e) => setRevenueModel(e.target.value)}>
                <option>Yes</option><option>No</option>
              </select>
            </div>
            <div className="form-section">
              <h4>Validation & Traction</h4>
              <p className="hint">Helps us understand real-world validation</p>
              <label>Customer Validation</label>
              <select value={customerValidation} onChange={(e) => setCustomerValidation(e.target.value)}>
                <option>No users</option><option>Early users</option><option>Paying customers</option>
              </select>
            </div>
            <div className="buttons">
              <button className="back" onClick={() => setStep(2)}>Back</button>
              <button onClick={() => setStep(4)}>Next →</button>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="panel card">
            <h2>Step 4: Execution Power</h2>
            <p className="helper">Tell us about your team and execution capability.</p>
            <div className="form-section">
              <h4>Team Structure</h4>
              <label>Team Size</label>
              <input type="number" min="1" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} placeholder="e.g. 5" />
              <label>Founder Experience</label>
              <select value={founderExperience} onChange={(e) => setFounderExperience(e.target.value)}>
                <option>First-time</option><option>Experienced</option>
              </select>
            </div>
            <div className="form-section">
              <h4>Team Capability</h4>
              <p className="hint">Helps evaluate execution strength</p>
              <label>Team Skill Coverage</label>
              <select value={teamSkills} onChange={(e) => setTeamSkills(e.target.value)}>
                <option>Limited</option><option>Balanced</option><option>Strong</option>
              </select>
            </div>
            <div className="buttons">
              <button className="back" onClick={() => setStep(3)}>Back</button>
              <button onClick={() => setStep(5)} disabled={!teamSize}>Next →</button>
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div className="panel card">
            <h2>Step 5: Financial & Market Signals</h2>
            <p className="helper">Provide financial strength and market competitiveness details.</p>
            <div className="form-section">
              <h4>Financial Strength</h4>
              <label>Funding Amount ($)</label>
              <input
                type="number" min="0"
                value={fundingAmount}
                onChange={(e) => setFundingAmount(e.target.value)}
                placeholder="e.g. 500000 — enter 0 if bootstrapped"
              />
              <label>Funding Stage</label>
              <select value={fundingStage} onChange={(e) => setFundingStage(e.target.value)}>
                <option>Bootstrapped</option><option>Seed</option><option>Series A+</option>
              </select>
              <label>Investor Quality</label>
              <select value={investorQuality} onChange={(e) => setInvestorQuality(e.target.value)}>
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>
            <div className="form-section">
              <h4>Market Competition</h4>
              <p className="hint">Helps assess competitive pressure and risk</p>
              <label>Competition Level</label>
              <select value={competition} onChange={(e) => setCompetition(e.target.value)}>
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>
            {error && <p className="error-msg">{error}</p>}
            <div className="buttons">
              <button className="back" onClick={() => setStep(4)}>Back</button>
              <button onClick={handleSubmitAndGoToResults} disabled={fundingAmount === "" || loading}>
                {loading ? "Analyzing…" : "Get Results →"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 6 — RESULTS */}
        {step === 6 && report && (
          <div className="panel">
            <div className="result-top">
              <h2>Startup Success Probability</h2>
              <div
                className="score-circle"
                style={{
                  background: report.success.percentage >= 70
                    ? "linear-gradient(135deg,#22c55e,#16a34a)"
                    : report.success.percentage >= 45
                    ? "linear-gradient(135deg,#f59e0b,#d97706)"
                    : "linear-gradient(135deg,#ef4444,#dc2626)",
                }}
              >
                {report.success.percentage}%
              </div>
              <p className="confidence">Confidence: {report.success.confidence}</p>
            </div>

            <div className="form-section">
              <h4>Startup Overview</h4>
              <div className="overview-grid">
                {[
                  { label: "Industry",    value: report.overview.industry,        detail: report.overview.industryInsight,    color: "#6366f1" },
                  { label: "Target",      value: report.overview.targetSegment,   detail: report.overview.targetInsight,      color: "#22c55e" },
                  { label: "Opportunity", value: report.overview.opportunityArea, detail: report.overview.opportunityInsight, color: "#f59e0b" },
                  { label: "Concern",     value: report.overview.keyConcern,      detail: report.overview.concernInsight,     color: "#ef4444" },
                ].map(({ label, value, detail, color }) => (
                  <div key={label} className="overview-card" style={{ borderTop: `3px solid ${color}` }}>
                    <span className="overview-label">{label}</span>
                    <strong>{value}</strong>
                    <p>{detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h4>Key Scores</h4>
              <ScoreBar label="Idea Strength"        {...report.scores.ideaStrength} />
              <ScoreBar label="Market Potential"     {...report.scores.marketPotential} />
              <ScoreBar label="Business Viability"   {...report.scores.businessViability} />
              <ScoreBar label="Execution Capability" {...report.scores.executionCapability} />
              <ScoreBar label="Financial Strength"   {...report.scores.financialStrength} />
            </div>

            <div className="insights-risks-grid">
              <div className="form-section insight-card">
                <h4>✅ Key Insights</h4>
                <ul>{report.insights.map((item, i) => <li key={i}>{item}</li>)}</ul>
              </div>
              <div className="form-section risk-card">
                <h4>⚠️ Risks</h4>
                <ul>{report.risks.map((item, i) => <li key={i}>{item}</li>)}</ul>
              </div>
            </div>

            <div className="form-section recommendation">
              <h4>Final Recommendation</h4>
              <p>{report.recommendation}</p>
            </div>

            <div className="buttons">
              <button onClick={() => {
                setStep(1); setReport(null); setMlScore(null); setAnalysis(null); setIdea("");
              }}>
                Start Over
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;

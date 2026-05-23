import bcrypt from "bcryptjs";
import type { DB } from "./db";

export function seedData(): DB {
  const now = new Date().toISOString();
  const adminHash = bcrypt.hashSync("admin123", 10);
  const memberHash = bcrypt.hashSync("member123", 10);

  const adminId = "usr_admin0001";
  const aliceId = "usr_alice0001";
  const bobId = "usr_bob000001";
  const carlaId = "usr_carla0001";

  return {
    users: [
      {
        id: adminId,
        name: "FinX Admin",
        email: "admin@finxsystems.com",
        passwordHash: adminHash,
        role: "admin",
        status: "approved",
        skills: "Operations, Strategy",
        bio: "Steward of the FinX Ideas community.",
        joinedAt: now,
      },
      {
        id: aliceId,
        name: "Alice Chen",
        email: "alice@finxsystems.com",
        passwordHash: memberHash,
        role: "member",
        status: "approved",
        skills: "AI Research, Python, LLMs",
        bio: "Building agents that think in markets.",
        link: "https://github.com/alicechen",
        joinedAt: now,
      },
      {
        id: bobId,
        name: "Bob Martin",
        email: "bob@finxsystems.com",
        passwordHash: memberHash,
        role: "member",
        status: "approved",
        skills: "Fintech, Risk, SQL",
        bio: "Credit risk meets machine learning.",
        joinedAt: now,
      },
      {
        id: carlaId,
        name: "Carla Reyes",
        email: "carla@finxsystems.com",
        passwordHash: memberHash,
        role: "member",
        status: "approved",
        skills: "Product, Automation, RPA",
        bio: "Workflows that disappear.",
        joinedAt: now,
      },
    ],
    requests: [
      {
        id: "req_demo000001",
        name: "Dana Park",
        email: "dana@example.com",
        skills: "ML Engineering, NLP",
        reason: "Excited to contribute ideas on retrieval-augmented fintech copilots.",
        link: "https://linkedin.com/in/danapark",
        status: "pending",
        createdAt: now,
      },
    ],
    ideas: [
      {
        id: "idea_0001",
        authorId: aliceId,
        title: "Agentic credit underwriting copilot",
        body:
          "An internal agent that pulls applicant signals, cross-checks fraud heuristics, and writes a recommendation memo a human can ratify in under 90 seconds. Key risk: hallucinated cashflow inference — mitigation: structured tool calls + cite-or-refuse policy.",
        summary:
          "Agent assistant that drafts underwriting memos with cited signals, accelerating human review.",
        category: "Fintech",
        tags: ["AI", "Underwriting", "Agents"],
        visibility: "community",
        createdAt: now,
        bookmarks: [bobId, carlaId],
        likes: [bobId, carlaId, adminId],
        upvotes: [bobId, carlaId, adminId],
        downvotes: [],
      },
      {
        id: "idea_0002",
        authorId: bobId,
        title: "Zero-friction reconciliation between ledgers",
        body:
          "Use embeddings to match transactions across mismatched naming conventions between sub-ledgers. Pilot on the SMB cohort first; expect 40-60% reduction in manual touch.",
        summary:
          "Embedding-based ledger reconciliation to cut manual matching by ~50% in SMB ops.",
        category: "Automation",
        tags: ["Embeddings", "Ops", "Finance"],
        visibility: "community",
        createdAt: now,
        bookmarks: [aliceId],
        likes: [aliceId, carlaId],
        upvotes: [aliceId, carlaId],
        downvotes: [],
      },
      {
        id: "idea_0003",
        authorId: carlaId,
        title: "Internal AI prompt library with provenance",
        body:
          "Treat prompts like code: versioned, reviewed, and tied to evaluations. Internal only. Helps teams stop re-inventing prompt patterns.",
        summary: "Versioned, evaluated prompt library treated as a first-class internal asset.",
        category: "AI",
        tags: ["Prompts", "Internal", "DX"],
        visibility: "internal",
        createdAt: now,
        upvotes: [aliceId, bobId, adminId],
        downvotes: [],
        bookmarks: [aliceId, bobId],
        likes: [aliceId, bobId],
      },
      {
        id: "idea_0004",
        authorId: aliceId,
        title: "Founder office hours, AI-curated",
        body:
          "Match members to founder office hour slots using stated goals + recent activity in the portal.",
        summary: "Smart matching for founder office hours based on portal activity.",
        category: "Community",
        tags: ["Startups", "Matching"],
        visibility: "community",
        createdAt: now,
        upvotes: [carlaId],
        downvotes: [bobId],
        bookmarks: [],
        likes: [carlaId],
      },
    ],
    comments: [
      {
        id: "cm_0001",
        ideaId: "idea_0001",
        authorId: bobId,
        body: "Strong. Curious how you'd test against adversarial applications.",
        createdAt: now,
      },
      {
        id: "cm_0002",
        ideaId: "idea_0001",
        authorId: carlaId,
        body: "Pairs well with our doc-extraction pipeline — happy to collaborate.",
        createdAt: now,
      },
      {
        id: "cm_0003",
        ideaId: "idea_0002",
        authorId: aliceId,
        body: "Embedding model choice matters here — benchmark a few.",
        createdAt: now,
      },
    ],
    categories: ["AI", "Fintech", "Automation", "Startups", "Future Tech", "Community"],
    spaces: [
      {
        id: "sp_0001",
        name: "Agentic Finance",
        description: "Cross-team space exploring agent architectures applied to financial workflows.",
        members: [aliceId, bobId, carlaId],
        createdAt: now,
      },
      {
        id: "sp_0002",
        name: "Automation Lab",
        description: "Pragmatic automation, RPA, and internal-tools experiments.",
        members: [carlaId, bobId],
        createdAt: now,
      },
    ],
  };
}

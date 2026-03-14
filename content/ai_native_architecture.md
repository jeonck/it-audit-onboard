# AI 네이티브 아키텍처 (AI-Native / Agentic Architecture)

AI 네이티브 아키텍처 (AI-Native / Agentic Architecture) 의 전체 구성도를 2026 년 3 월 기준 실무에서 가장 많이 참조되는 패턴으로 정리했습니다.

현재 대부분의 기업·프로젝트는 **단일 LLM 중심이 아니라 Compound / Agentic 시스템을 표준**으로 삼고 있으며, **UI → Orchestration → AI Core → Tools & Data → Infrastructure**라는 5 계층 (또는 6~8 계층 변형) 이 주류입니다.

---

## 2026 년 표준 AI-Native / Agentic 아키텍처 개요 (5 대 계층 중심)

| 계층 (Layer) | 한국어 명칭 | 주요 역할 & 구성 요소 | 왜 중요한가? (2026 년 관점) | 대표 기술 / 프레임워크 (실무 예시) | 흐름에서의 위치 |
|:---:|---|---|---|---|---|
| **1** | **UI / Experience Layer** | 사용자 경험 / 인터페이스 계층<br>사용자 입력 수집 (웹·모바일·보이스·임베디드), Intent 파싱, 스트리밍 응답, AI-Native UI (probabilistic UI, streaming text, multi-modal) | 인간-AI 상호작용의 첫 접점. AI 가 "느낌" 좋게 느껴지게 하는 핵심 | React/Vue/Svelte + Vercel AI SDK, Streamlit, Gradio, AI-Native frameworks (v0, Cursor UI) | 사용자 → Orchestration |
| **2** | **Orchestration Layer** | 오케스트레이션 / 조정 계층<br>Agent routing, multi-agent coordination, workflow chaining, planning, ReAct/Reflexion 루프, model selection, guardrails, human-in-the-loop gate | 복잡한 multi-step 작업을 "지휘"하는 뇌. 단일 LLM 으로는 불가능한 자율성·신뢰성 제공 | LangGraph, CrewAI, AutoGen, Semantic Kernel, LlamaIndex Workflows, Microsoft AutoGen | UI → AI Core + Tools/Data |
| **3** | **AI Core (Intelligence Layer)** | AI 코어 / 지능 계층<br>LLM 추론 엔진, reasoning engine, memory (short/long-term), reflection/self-correction, multi-model routing | "생각하는" 부분. Compound AI 의 중심 | Claude 4 / GPT-5 mini / Gemini 2.5 / Llama 4 계열 + Router (LiteLLM, OpenRouter, Databricks Mosaic AI Gateway) | Orchestration 이 호출 |
| **4** | **Tools & Data Layer** | 도구 + 데이터 계층<br>Tools (function calling, APIs, code exec), RAG/GraphRAG, vector DB, knowledge base, memory stores, external systems 연동 | grounding + action 가능하게 함. 환각↓, 실세계 영향력↑ | Pinecone/Qdrant/Weaviate (Vector), MCP servers, Tool calling (OpenAI Functions, Anthropic Tools), SQL/NoSQL, CRM/ERP APIs | AI Core 가 호출 → 결과 반환 |
| **5** | **Infrastructure Layer** | 인프라 / 기반 계층<br>Compute (GPU/TPU 클러스터), orchestration runtime (K8s), observability, secrets, scaling, cost control | 안정적·확장 가능·비용 효율적 운영의 기반 | Kubernetes + NVIDIA GPU Operator, Terraform, AWS/GCP/Azure AI infra, Prometheus/Grafana, Vault | 모든 계층을 받침 |

---

## 전체 흐름도 텍스트 버전 (상→하 방향, 가장 흔한 패턴)

```
[사용자] 
   ↓ (질문 / Goal 입력)
UI / Experience Layer
   ↓ (Intent + Context 캡처 → API 호출)
Orchestration Layer
   ├─→ Router / Planner → 적합한 모델 선택
   ├─→ ReAct / Plan-Execute 루프 시작
   │     ↓
AI Core (LLM Reasoning Engine + Memory)
   │     ↓ (Tool call 필요 시)
   └─→ Tools & Data Layer
         ├─→ RAG → Vector DB 검색
         ├─→ External APIs / Internal DB / Code Exec
         └─→ Observation 결과 반환
   ↑ (피드백 루프 반복 → Reflection / Correction)
Orchestration → 최종 Response Builder (Guardrails + Formatting)
   ↓
UI Layer → 사용자에게 스트리밍 / 최종 출력
   ↓ (백그라운드)
Infrastructure Layer (K8s scaling, monitoring, secrets)
```

---

## 2026 년 실무 변형 패턴 요약

### 5 계층 기본형

```
Experience → Intelligence/Orchestration → Knowledge/Data → Infra
```

- **Salesforce Agentforce, Medium AI-Ledger, 많은 기업 블루프린트에서 채택**

---

### 7~8 계층 확장형

```
Infrastructure → Runtime → Orchestration → Tools/Enrichment → Applications → Observability/Governance
```

- **AIMultiple, Aakash Gupta 등**

---

### 3 계층 간소형

```
Core Intelligence → Action/Execution → Governance/Human Oversight
```

- **Unanimous Tech 등 신뢰성 중심**

---

### 가장 핫한 조합 (실제 배포 비중 높음)

```
LangGraph (Orchestration) + Pinecone/Qdrant (Data) + Claude/GPT (Core) + MCP/dynamic tools (Tools) + K8s + Observability
```

---

## 요약

> 이 구성은 **단순 챗봇 → 진짜 일하는 Agentic 시스템**으로 가는 길의 **표준 청사진**입니다.

---

## 감리 관점에서의 시사점

정보시스템 감리 관점에서 AI 네이티브 아키텍처 도입 시 고려사항:

1. **계층별 책임 분리**: 각 계층의 역할과 책임이 명확히 분리되었는지 검증
2. **Orchestration 복잡도 관리**: multi-agent 조정, workflow chaining 의 추적성과 디버깅 용이성 확인
3. **AI Core 모델 중립성**: 특정 벤더 종속 (Lock-in) 위험과 multi-model routing 적절성 평가
4. **Tools & Data 보안**: 외부 API 연동, RAG 파이프라인의 접근제어와 데이터 무결성 검증
5. **Infrastructure 확장성**: GPU/TPU 클러스터 스케일링, 비용 통제 (FinOps) 메커니즘 확인
6. **Observability**: 전 계층에 걸친 로그·메트릭·추적 (Distributed Tracing) 수집 체계 검증
7. **Human-in-the-loop**: 중요 의사결정 시 인간 개입 포인트와 승인 프로세스 명확성 확인

---

> **참고**: 본 자료는 정보시스템 감리 업무 수행 시 AI 네이티브 아키텍처 검토를 위한 참고 자료입니다.

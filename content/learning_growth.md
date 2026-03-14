# 학습과성장

정보시스템 감리 업무를 수행하면서 필요한 개발방법론과 기술정보에 대한 자료입니다.

---

## 📊 빠른 링크 (Quick Links)

| AI 개발방법론 | MSA/아키텍처 | MCP/A2A | 인프라/서빙 |
|--------------|-------------|---------|------------|
| [AI 시대 개발방법론](#ai_development_methodology) | [Compound AI 아키텍처](#compound_ai_architecture) | [MCP 기초](#mcp_fundamentals) | [vLLM 모델서빙](#vllm_serving) |
| [AI-DLC](#ai_dlc) | [MSA 핵심 원칙](#msa_core_principles) | [MCP vs REST](#mcp_vs_rest) | [AI 인프라 이슈](#ai_infrastructure_challenges) |
| [Bolt/Mob 세션](#ai_dlc_bolt_mob) | [MSA 핵심 패턴](#msa_core_patterns) | [REST vs MCP](#rest_vs_mcp_flexibility) | [Cerebras AI](#cerebras_ai) |
| [Compound AI](#compound_ai) | [Bounded Context](#bounded_context_msa) | [MCP vs A2A](#mcp_vs_a2a) | [Diffusion LLM](#diffusion_llm) |
| [RAG](#rag) | [DDD 핵심개념](#ddd_core_concepts) | [Agent Card](#agent_card) | [Python uv](#python_uv) |
| [ReAct 패턴](#react_pattern) | [EDA 심화](#eda_deep_dive) | [Claude Skills](#claude_skills_vs_mcp) | |
| [CodeRabbit](#coderabbit_guide) | [동기 vs 비동기](#sync_vs_async_communication) | [A2A 협업패턴](#a2a_collaboration_patterns) | |

| 설계/최적화 | 품질/보안 | 실습/기타 |
|------------|----------|----------|
| [AI 네이티브 아키텍처](#ai_native_architecture) | [AI 품질보장](#ai_quality_assurance) | [AI 실습자료](#ai-실습-자료) |
| [설계 원리](#ai_architecture_tradeoffs) | [AI 폴백전략](#ai_fallback_strategies) | [GitHub 실습](https://github.com/frentis-ai-study/ai-sw-architecture) |
| [Latency 최적화](#ai_latency_optimization) | [챗봇 vs 파이프라인](#chatbot_vs_pipeline) | [감리역량강화](#감리-역량-강화) |
| [비용최적화](#ai_cost_optimization) | [도메인별파이프라인](#domain_specific_ai) | [인증기술자료](#인증-기술-자료) |
| [모델라우팅](#ai_model_routing) | [모놀리스한계](#monolith_limitations) | |
| [아키텍처선택](#ai_architecture_decision_tree) | [MSA 분해](#ai_service_decomposition) | |
| [MCP 최적화](#mcp_context) | [agent-browser](#vercel_agent_browser) | |

---

## 감리 역량 강화

### 전문 자격증
| 자격증 | 설명 |
|--------|------|
| **정보시스템감리사** | 국내 공인 감리 전문 자격 |
| **CISSP** | 국제 보안 전문가 인증 |
| **PMP** | 프로젝트 관리 전문가 |
| **AWS/Azure** | 클라우드 플랫폼 자격증 |

### 추천 학습 자료
- 정보시스템 감리기준 (행정안전부 고시)
- SW 품질 가이드라인
- 클라우드 보안 가이드라인
- AI 기술 동향 보고서

---

## 인증 기술 자료

### 소셜 인증 vs 본인 인증
- [자세히 보기](#social_identity_auth) - 소셜 로그인과 본인인증의 비교 및 아키텍처 설계 가이드

---

## AI 시대 개발방법론

| 콘텐츠 | 설명 |
|--------|------|
| [2025~2026 AI 시대 개발 방법론](#ai_development_methodology) | AI 증강 개발, 에이전틱 개발, SDLC 진화 |
| [AI-DLC](#ai_dlc) | AWS 제안 AI 네이티브 개발 방법론, 3 단계 lifecycle |
| [Bolt 와 Mob 세션](#ai_dlc_bolt_mob) | AI-DLC 핵심 개념, 초고속 협업 리추얼 |
| [Compound AI 시스템](#compound_ai) | Compound AI 핵심 구성 요소, 오케스트레이션 |
| [Compound AI 아키텍처](#compound_ai_architecture) | 상세 아키텍처 설계, 5 단계 보안/품질 보장 |
| [RAG](#rag) | RAG 핵심 3 단계, 구성 요소, 실무 가이드 |
| [MCP 컨텍스트 최적화](#mcp_context) | MCP 컨텍스트 과소비 해결 방안 |
| [ReAct 패턴](#react_pattern) | AI 에이전트 제어 패턴, Reasoning + Acting |
| [CodeRabbit 활용 가이드](#coderabbit_guide) | AI 주도 개발 PR 리뷰, CodeRabbit 워크플로우 |

---

## MSA & 아키텍처

| 콘텐츠 | 설명 |
|--------|------|
| [AI 네이티브 아키텍처](#ai_native_architecture) | AI-Native/Agentic 아키텍처 5 계층 |
| [MSA 핵심 원칙](#msa_core_principles) | 독립배포/장애격리/독립스케일링 |
| [MSA 핵심 패턴](#msa_core_patterns) | API GW/서비스디스커버리/서킷브레이커 |
| [Bounded Context 설계](#bounded_context_msa) | MSA 서비스 경계 설계 가이드 |
| [DDD 핵심 개념](#ddd_core_concepts) | 도메인 주도 설계 핵심 개념 |
| [EDA 심화](#eda_deep_dive) | 이벤트 드리븐 아키텍처 심화 가이드 |
| [동기 vs 비동기 통신](#sync_vs_async_communication) | REST 와 이벤트 기반 통신 비교 |
| [AI 서비스 MSA 분해](#ai_service_decomposition) | 비즈니스/모델/운영 기반 분해 전략 |
| [모놀리스 아키텍처 한계](#monolith_limitations) | 장애전파/기술종속/스케일링 비효율 |

---

## MCP & A2A 프로토콜

| 콘텐츠 | 설명 |
|--------|------|
| [MCP 기초](#mcp_fundamentals) | Model Context Protocol 핵심 개념 |
| [MCP vs REST API](#mcp_vs_rest) | AI 통신 프로토콜 비교 분석 |
| [REST vs MCP 유연성](#rest_vs_mcp_flexibility) | 결정론적 vs 비결정론적 접근 |
| [MCP vs A2A](#mcp_vs_a2a) | 도구연결 vs 협업지능 표준 |
| [Agent Card](#agent_card) | A2A 에이전트 디지털 신분증 |
| [Claude Skills vs MCP](#claude_skills_vs_mcp) | 컨텍스트 효율화 전략 |
| [A2A 협업 패턴](#a2a_collaboration_patterns) | 오케스트레이터/파이프라인/P2P |
| [Vercel agent-browser](#vercel_agent_browser) | 컨텍스트 효율화 브라우징 도구 |

---

## 설계 & 최적화

| 콘텐츠 | 설명 |
|--------|------|
| [AI 아키텍처 설계 원리](#ai_architecture_tradeoffs) | Cost·Latency·Quality 트레이드오프 균형 |
| [AI Latency 최적화 전략](#ai_latency_optimization) | 지연 시간 최적화 10 가지 전략 |
| [AI 비용 최적화 전략](#ai_cost_optimization) | 토큰 효율화, 모델 계층화, 캐싱 |
| [AI 모델 라우팅 전략](#ai_model_routing) | 규칙/의도/비용/케스케이드 라우팅 |
| [AI 아키텍처 선택 가이드](#ai_architecture_decision_tree) | 비용 -품질 균형 의사결정 트리 |
| [AI 인프라 설계 이슈](#ai_infrastructure_challenges) | GPU/토큰/버전/보안 고난도 이슈 |
| [AI Observability](#ai_observability) | AI 시스템 관측 가능성 (환각/비용/보안) |
| [vLLM 모델 서빙](#vllm_serving) | 초고속 LLM 서빙 프레임워크 |

---

## 품질 & 보안

| 콘텐츠 | 설명 |
|--------|------|
| [AI 품질 보장 전략](#ai_quality_assurance) | 가드레일, 환각 방지, 검증 루프 |
| [AI 폴백 전략](#ai_fallback_strategies) | 가용성/품질/속도/콘텐츠 폴백 |
| [챗봇 vs AI 파이프라인](#chatbot_vs_pipeline) | 단순 챗봇과 Compound AI 시스템 비교 |
| [도메인별 AI 파이프라인](#domain_specific_ai) | 금융/기업/의료 도메인 적용 비교 |
| [RAGAS 품질 평가](#ragas_evaluation) | RAG 품질 정량 평가 (Faithfulness/Relevance) |

---

## AI 실습 자료

| 콘텐츠 | 설명 |
|--------|------|
| [AI 소프트웨어 아키텍처 실습](https://github.com/frentis-ai-study/ai-sw-architecture) | AI SW 아키텍처 실습 자료 (GitHub) |
| [Python uv 패키지매니저](#python_uv) | 초고속 Python 패키지 매니저 uv 가이드 |

---

## AI 기술 및 하드웨어

| 콘텐츠 | 설명 |
|--------|------|
| [Cerebras AI 서비스 사례](#cerebras_ai) | AI 전용 하드웨어, Wafer-Scale Engine, 추론 가속화 |
| [Diffusion LLM](#diffusion_llm) | Diffusion LLM, Inception Labs, 초고속 추론 |

---

> **참고**: 본 섹션은 정보시스템 감리인의 지속적인 학습과 역량 강화를 위한 자료입니다.  
> 새로운 기술과 방법론이 추가될 예정입니다.

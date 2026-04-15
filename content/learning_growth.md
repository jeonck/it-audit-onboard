# 학습과성장

정보시스템 감리 업무를 수행하면서 필요한 개발방법론과 기술정보에 대한 자료입니다.

---

## 📊 빠른 링크 (Quick Links)

| AI 개발방법론 | MSA/아키텍처 | MCP/A2A | 인프라/서빙 | 모바일/Mobile |
|--------------|-------------|---------|------------|---------------|
| [AI 시대 개발방법론](#ai_development_methodology) | [Compound AI 아키텍처](#compound_ai_architecture) | [MCP 기초](#mcp_fundamentals) | [vLLM 모델서빙](#vllm_serving) | [PWA 배포 전략](#pwa_deployment_strategy) |
| [AI-DLC](#ai_dlc) | [MSA 핵심 원칙](#msa_core_principles) | [MCP vs REST](#mcp_vs_rest) | [AI 인프라 이슈](#ai_infrastructure_challenges) | [모바일 앱 컨설팅](https://jeonck.github.io/mobile-app-consulting/) |
| [Bolt/Mob 세션](#ai_dlc_bolt_mob) | [MSA 핵심 패턴](#msa_core_patterns) | [REST vs MCP](#rest_vs_mcp_flexibility) | [Cerebras AI](#cerebras_ai) | |
| [Compound AI](#compound_ai) | [Bounded Context](#bounded_context_msa) | [MCP vs A2A](#mcp_vs_a2a) | [Diffusion LLM](#diffusion_llm) | |
| [RAG](#rag) | [DDD 핵심개념](#ddd_core_concepts) | [Agent Card](#agent_card) | [Python uv](#python_uv) | |
| [ReAct 패턴](#react_pattern) | [EDA 심화](#eda_deep_dive) | [Claude Skills](#claude_skills_vs_mcp) | | |
| [CodeRabbit](#coderabbit_guide) | [동기 vs 비동기](#sync_vs_async_communication) | [A2A 협업패턴](#a2a_collaboration_patterns) | | |
| [하네스 엔지니어링](#harness_engineering) | | | | |

| 설계/최적화 | 품질/보안 | 실습/기타 |
|------------|----------|----------|
| [AI 네이티브 아키텍처](#ai_native_architecture) | [AI 품질보장](#ai_quality_assurance) | [AI 실습자료](#ai-실습-자료) |
| [설계 원리](#ai_architecture_tradeoffs) | [AI 폴백전략](#ai_fallback_strategies) | [GitHub 실습](https://github.com/frentis-ai-study/ai-sw-architecture) |
| [Latency 최적화](#ai_latency_optimization) | [챗봇 vs 파이프라인](#chatbot_vs_pipeline) | [감리역량강화](#감리-역량-강화) |
| [비용최적화](#ai_cost_optimization) | [도메인별파이프라인](#domain_specific_ai) | |
| [모델라우팅](#ai_model_routing) | [모놀리스한계](#monolith_limitations) | |
| [아키텍처선택](#ai_architecture_decision_tree) | [MSA 분해](#ai_service_decomposition) | |
| [MCP 최적화](#mcp_context) | [agent-browser](#vercel_agent_browser) | |
| [ISP & IT Consulting](https://jeonck.github.io/isp-it-consulting/) | | |

> **💡 링크를 클릭하면 각 주제별 상세 콘텐츠를 바로 확인할 수 있습니다.**

---

## 감리 역량 강화

### 분야별 전문 자격증 매핑

| 진단 분야 | 관련 자격증 |
|----------|------------|
| **ODA 해외감리** | [ODA 자격증](#oda_certification) - KOICA/EDCF 글로벌 공공사업 감리 전문가 |
| **기술진단** | 정보처리기사/[기술사](https://jeonck.github.io/itpe-portal/#/topics), TOGAF, AWS/Azure/GCP 아키텍트, CSTS |
| **SW 보안약점 진단** | SW보안약점진단원, CISSP, CISA, OSCP, 정보보호최고책임관리사(CISO), 정보보안기사 |
| **개인정보 진단** | PIA(개인정보영향평가), ISMS-P인증심사원, CIPP, CIPM, CIPT, KISA 개인정보보호전문가 |
| **웹 접근성 진단** | WA(Web Accessibility) 전문가, 정보처리기사 |
| **데이터 품질점검** | DAP(Data Analyst Professional), 공공데이터품질심사원, DAsP, CDMP(국제데이터전문가), ADSP(데이터분석준전문가) |
| **성능 진단** | 정보처리기술사, AWS/Azure 성능최적화 자격 |
| **기능점수 측정** | IFPUG-CFPP, IFPUG-CFPS, CFPS(Certified Function Point Specialist), OKFSP |
| **기능 테스트** | ISTQB(국제소프트웨어테스팅자격), 정보처리산업기사 |
| **연계 점검** | 정보처리기사, ITIL Foundation |
| **웹 취약점 점검** | CEH, OSCP, 정보보안기사, FSEC |
| **UI/UX** | UXQ(Certified User Experience Professional), HCI 관련 자격 |
| **K8s 클라우드 네이티브** | CKA(Admin), CKAD(Developer), CKS(Security), 클라우드마스터 |
| **AI 점검** | Google Cloud ML Engineer, AWS ML Specialty, AI 관련 국가기술자격 |

### 추천 학습 자료
- 정보시스템 감리기준 (행정안전부 고시)
- SW 품질 가이드라인
- 클라우드 보안 가이드라인
- AI 기술 동향 보고서

---

> **참고**: 본 섹션은 정보시스템 감리인의 지속적인 학습과 역량 강화를 위한 자료입니다.
> 새로운 기술과 방법론이 추가될 예정입니다.

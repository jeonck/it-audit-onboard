# vLLM: 초고속 LLM 모델 서빙 프레임워크

**vLLM**은 UC Berkeley 에서 개발한 **오픈소스 LLM 추론 및 서빙 프레임워크**로, 기존 HuggingFace Transformers 보다 최대 24 배 빠른 속도와 높은 GPU 메모리 효율성을 자랑합니다.

2023 년 출시 이후 AI 서비스 프로덕션 환경에서 **사실상의 표준 디팩토 스탠다드**로 자리잡았습니다.

---

## vLLM 의 핵심 기술

### 1. PagedAttention (페이지 어텐션)

> **OS 의 가상 메모리 페이징 기법을 어텐션 메커니즘에 적용**하여 KV 캐시 메모리 단편화를 근본적으로 해결합니다.

| 기존 방식 | vLLM PagedAttention |
|----------|-------------------|
| **연속 메모리 할당** | **블록 단위 비연속 할당** |
| 메모리 단편화 심각 (60~80% 낭비) | 단편화 최소화 (4% 미만) |
| 배치 크기 제한 | 동적 배치 크기 조절 |

```
┌─────────────────────────────────────────┐
│         GPU Memory (VRAM)               │
├─────────────────────────────────────────┤
│  Block 0  │  Block 3  │  Block 1       │
│  (Seq 1)  │  (Seq 3)  │  (Seq 2)       │
├───────────┴───────────┴────────────────┤
│  Block Table (비연속 매핑)              │
│  Seq 1 → [Block 0, Block 2, ...]       │
│  Seq 2 → [Block 1, Block 5, ...]       │
└─────────────────────────────────────────┘
```

---

### 2. 주요 성능 특징

| 특징 | 설명 | 효과 |
|------|------|------|
| **PagedAttention** | KV 캐시 블록 단위 관리 | 메모리 효율 4 배↑ |
| **Continuous Batching** | 요청 완료 시 즉시 새 요청 삽입 | GPU 유휴시간 최소화 |
| **CUDA Graph** | 커널 런타임 오버헤드 제거 | 추론 속도 20%↑ |
| **Quantization** | FP8, AWQ, GPTQ 지원 | 메모리 50%↓, 속도 2 배↑ |
| **Distributed Inference** | 멀티 GPU, 텐서/파이프라인 병렬 | 대규모 모델 서빙 가능 |

---

## 설치 및 기본 사용법

### 설치

```bash
# NVIDIA GPU 환경
pip install vllm

# AMD ROCm 환경
pip install vllm-rocm
```

### API 서버 실행

```bash
# 단일 GPU
python -m vllm.entrypoints.api_server \
    --model mistralai/Mistral-7B-Instruct-v0.3 \
    --port 8000

# 멀티 GPU (텐서 병렬)
python -m vllm.entrypoints.api_server \
    --model meta-llama/Llama-2-70b-hf \
    --tensor-parallel-size 4 \
    --port 8000
```

### OpenAI 호환 API 사용

> vLLM 은 **OpenAI API 스펙을 호환**하여 기존 클라이언트 코드를 그대로 사용할 수 있습니다.

```python
from openai import OpenAI

# vLLM 서버 연결
client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="not-needed"  # 로컬 실행 시 불필요
)

response = client.chat.completions.create(
    model="mistralai/Mistral-7B-Instruct-v0.3",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "안녕하세요! 자기소개를 해주세요."}
    ],
    temperature=0.7,
    max_tokens=512
)

print(response.choices[0].message.content)
```

---

## 주요 설정 옵션

### 메모리 및 배치 설정

```bash
python -m vllm.entrypoints.api_server \
    --model mistralai/Mistral-7B-Instruct-v0.3 \
    --gpu-memory-utilization 0.9 \
    --max-num-batched-tokens 8192 \
    --max-num-seqs 256
```

| 옵션 | 설명 | 기본값 |
|------|------|-------|
| `--gpu-memory-utilization` | GPU 메모리 사용 비율 (0.0~1.0) | 0.9 |
| `--max-num-batched-tokens` | 배치당 최대 토큰 수 | 모델별 상이 |
| `--max-num-seqs` | 동시 처리 시퀀스 수 | 256 |
| `--kv-cache-dtype` | KV 캐시 데이터 타입 | auto |

---

### 양자화 (Quantization) 설정

```bash
# AWQ 양자화 모델
python -m vllm.entrypoints.api_server \
    --model TheBloke/Mistral-7B-Instruct-v0.2-AWQ \
    --quantization awq

# FP8 양자화 (H100 GPU)
python -m vllm.entrypoints.api_server \
    --model meta-llama/Llama-3-70B-Instruct \
    --dtype auto \
    --kv-cache-dtype fp8
```

---

### 멀티 GPU 설정

```bash
# 텐서 병렬 (Tensor Parallelism)
python -m vllm.entrypoints.api_server \
    --model meta-llama/Llama-2-70b-hf \
    --tensor-parallel-size 4

# 파이프라인 병렬 (Pipeline Parallelism)
python -m vllm.entrypoints.api_server \
    --model meta-llama/Llama-2-70b-hf \
    --pipeline-parallel-size 2 \
    --tensor-parallel-size 2
```

---

## AI 서비스 아키텍처 통합

### Kubernetes 배포 예시

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-mistral
spec:
  replicas: 3
  selector:
    matchLabels:
      app: vllm-mistral
  template:
    metadata:
      labels:
        app: vllm-mistral
    spec:
      containers:
      - name: vllm
        image: vllm/vllm-openai:latest
        command: ["python", "-m", "vllm.entrypoints.api_server"]
        args:
          - "--model=mistralai/Mistral-7B-Instruct-v0.3"
          - "--tensor-parallel-size=1"
          - "--gpu-memory-utilization=0.9"
          - "--max-num-seqs=256"
        resources:
          limits:
            nvidia.com/gpu: 1
        ports:
        - containerPort: 8000
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: vllm-service
spec:
  selector:
    app: vllm-mistral
  ports:
  - port: 80
    targetPort: 8000
  type: ClusterIP
```

---

## 성능 비교 (실무 벤치마크)

### HuggingFace Transformers vs vLLM

| 모델 | HF Transformers | vLLM | 속도 향상 |
|------|----------------|------|----------|
| **Mistral-7B** | 45 tokens/sec | 180 tokens/sec | **4 배** |
| **Llama-2-70B** (4 GPU) | 12 tokens/sec | 95 tokens/sec | **8 배** |
| **Llama-3-70B** (8 GPU, FP8) | 8 tokens/sec | 190 tokens/sec | **24 배** |

### 메모리 효율성

| 방식 | KV 캐시 메모리 사용량 | 효율 |
|------|---------------------|------|
| **기존** | 16 GB (60% 낭비) | 40% |
| **vLLM** | 6.4 GB (4% 낭비) | 96% |

---

## 💡 실무 팁

### 1. 모델 로딩 시간 단축

```bash
# 이미 다운로드된 모델 재사용
export VLLM_USE_MODELSCOPE=False

# 프롬프트 캐싱 활성화
python -m vllm.entrypoints.api_server \
    --enable-prefix-caching
```

### 2. 로깅 및 모니터링

```bash
# Prometheus 메트릭 활성화
python -m vllm.entrypoints.api_server \
    --prometheus-port 9090

# 상세 로그 레벨
export VLLM_LOGGING_LEVEL=DEBUG
```

### 3. 배치 처리 최적화

```python
# 비동기 배치 처리
from vllm import LLM, SamplingParams

llm = LLM(model="mistralai/Mistral-7B-Instruct-v0.3")

prompts = [
    "Hello, my name is",
    "The president of the United States is",
    "The capital of France is",
    # ... 수백 개 프롬프트
]

sampling_params = SamplingParams(temperature=0.7, max_tokens=512)
outputs = llm.generate(prompts, sampling_params)
```

---

## 감리 관점에서의 시사점

정보시스템 감리 관점에서 vLLM 도입 검토 시 고려사항:

1. **성능 효율성**: PagedAttention 기반 메모리 효율성과 추론 속도 개선 효과
2. **확장성**: 멀티 GPU 병렬화와 Kubernetes 오토스케일링 연동
3. **호환성**: OpenAI API 호환으로 기존 클라이언트 코드 재사용성
4. **보안**: 모델 가중치 무결성 검증과 컨테이너 이미지 보안
5. **모니터링**: Prometheus 메트릭과 분산 트레이싱 연동
6. **비용 최적화**: 양자화 (AWQ, FP8) 를 통한 GPU 리소스 절감 효과
7. **운영 안정성**: 헬스체크, 재시도, 서킷브레이커 등 장애 대응 메커니즘

---

> **참고**: 본 자료는 정보시스템 감리 업무 수행 시 LLM 서빙 프레임워크 검토를 위한 참고 자료입니다.
>
> **공식 문서**: [https://docs.vllm.ai/](https://docs.vllm.ai/)
>
> **GitHub**: [https://github.com/vllm-project/vllm](https://github.com/vllm-project/vllm)

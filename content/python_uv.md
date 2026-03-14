# uv: 초고속 Python 패키지 매니저

**uv**는 Astral 에서 개발한 **초고속 Python 패키지 매니저**로, Rust 로 작성되어 기존 pip 보다 10~100 배 빠른 속도를 자랑합니다.

2024 년 출시 이후 AI/ML 프로젝트와 대규모 Python 프로젝트에서 표준 도구로 빠르게 자리잡고 있습니다.

---

## uv 의 핵심 특징

### 1. 압도적인 속도

> **pip 보다 10~100 배 빠릅니다.**

| 작업 | pip | uv | 속도 향상 |
|------|-----|----|----------|
| **패키지 설치** | 느림 (순차 처리) | 매우 빠름 (병렬 처리) | 10~100 배 |
| **가상환경 생성** | 수초 | 수백 ms | 50 배 이상 |
| **lock 파일 생성** | 분 단위 | 초 단위 | 10 배 이상 |

### 2. 올인원 도구

> **pip, pip-tools, poetry, pyenv, virtualenv 를 모두 대체**합니다.

| 기존 도구 | uv 대체 기능 |
|----------|-------------|
| **pip** | `uv pip install` |
| **pip-tools** | `uv pip compile` |
| **poetry** | `uv add`, `uv lock` |
| **pyenv** | `uv python install` |
| **virtualenv** | `uv venv` |

### 3. 재현 가능한 빌드

> **uv.lock 파일을 통해 정확한 패키지 버전 고정**이 가능합니다.

```bash
# lock 파일 생성
uv lock

# lock 파일 기반 설치 (재현 가능)
uv sync
```

---

## 주요 명령어

### 설치

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# pip 으로도 설치 가능
pip install uv
```

### 프로젝트 초기화

```bash
# 새 프로젝트 생성
uv init my-project
cd my-project

# 가상환경 생성
uv venv

# 패키지 설치
uv add requests pandas numpy
```

### 패키지 관리

```bash
# 패키지 설치
uv pip install requests

# requirements.txt 생성
uv pip compile requirements.in -o requirements.txt

# requirements.txt 기반 설치
uv pip sync requirements.txt
```

### Python 버전 관리

```bash
# 특정 Python 버전 설치
uv python install 3.12

# Python 버전 목록
uv python list

# 프로젝트 Python 버전 설정
uv python pin 3.12
```

---

## AI/ML 프로젝트에서의 uv 활용

### 1. 대용량 ML 패키지 설치

> PyTorch, TensorFlow 등 대용량 패키지 설치 시 속도 차이가 극적입니다.

```bash
# 기존 pip
pip install torch torchvision torchaudio
# → 5~10 분 소요

# uv
uv pip install torch torchvision torchaudio
# → 30 초~1 분 소요
```

### 2. 재현 가능한 AI 환경

```bash
# uv.lock 파일로 환경 고정
uv lock

# 다른 개발자가 동일한 환경으로 복제
git clone <repo>
uv sync
# → 모든 의존성이 정확히 복제됨
```

### 3. 멀티 Python 버전 테스트

```bash
# Python 3.10, 3.11, 3.12 동시 설치
uv python install 3.10 3.11 3.12

# 각 버전별로 테스트 환경 생성
uv venv --python 3.10 .venv-3.10
uv venv --python 3.11 .venv-3.11
uv venv --python 3.12 .venv-3.12
```

---

## CI/CD 통합

### GitHub Actions 예시

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install uv
        uses: astral-sh/setup-uv@v3
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version-file: ".python-version"
      
      - name: Install dependencies
        run: uv sync --frozen
      
      - name: Run tests
        run: uv run pytest
```

---

## pip 와의 비교

| 기능 | pip | uv |
|------|-----|----|
| **속도** | 느림 | 매우 빠름 (Rust 기반) |
| **가상환경** | external (venv 필요) | 내장 |
| **Python 관리** | external (pyenv 필요) | 내장 |
| **Lock 파일** | external (pip-tools 필요) | 내장 |
| **프로젝트 관리** | 없음 | 내장 (pyproject.toml) |
| **캐싱** | 제한적 | 자동, 효율적 |
| **메모리 사용** | 많음 | 적음 |

---

## uv 사용 시나리오

### 시나리오 1: 새 AI 프로젝트 시작

```bash
# 1. 프로젝트 생성
uv init ai-project
cd ai-project

# 2. Python 버전 설정
uv python pin 3.12

# 3. ML 패키지 설치
uv add torch pandas scikit-learn jupyter

# 4. 개발 도구 설치
uv add --dev pytest black ruff

# 5. 가상환경 활성화
source .venv/bin/activate
```

### 시나리오 2: 기존 프로젝트 마이그레이션

```bash
# 1. 기존 requirements.txt 를 uv 로 변환
uv pip compile requirements.txt -o requirements-uv.txt

# 2. uv 로 설치
uv pip sync requirements-uv.txt

# 3. 앞으로는 uv 사용
uv add <new-package>
```

### 시나리오 3: Docker 이미지 최적화

```dockerfile
FROM python:3.12-slim

# uv 설치
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치 (캐시 활용)
COPY requirements.txt .
RUN uv pip install --system -r requirements.txt

# 코드 복사
COPY . .

CMD ["python", "app.py"]
```

---

## 💡 실무 팁

### 1. uv 캐시 공유

> CI/CD 에서 캐시를 공유하면 빌드 시간이 더욱 단축됩니다.

```yaml
# GitHub Actions
- name: Cache uv
  uses: actions/cache@v4
  with:
    path: ~/.cache/uv
    key: uv-${{ hashFiles('uv.lock') }}
```

### 2. 오프라인 설치

> 네트워크가 제한된 환경에서도 설치 가능합니다.

```bash
# 캐시에서 직접 설치
uv pip install --offline package-name
```

### 3. 대체 인덱스 사용

> PyPI 미러나 사내 패키지 저장소 사용 시:

```bash
uv pip install --index-url https://pypi.tuna.tsinghua.edu.cn/simple package-name
```

---

## 감리 관점에서의 시사점

정보시스템 감리 관점에서 uv 도입 검토 시 고려사항:

1. **보안 검증**: 패키지 서명 검증과 hash 기반 무결성 확인 기능
2. **감사 추적성**: uv.lock 파일을 통한 의존성 버전의 명확한 추적
3. **재현성**: 동일한 환경의 재현 가능한 빌드 보장
4. **공급망 보안**: 신뢰할 수 있는 인덱스 사용과 패키지 소스 검증
5. **표준 준수**: PEP 표준 (pyproject.toml) 준수 여부
6. **운영 효율성**: CI/CD 파이프라인 통합과 빌드 시간 단축 효과

---

> **참고**: 본 자료는 정보시스템 감리 업무 수행 시 Python 패키지 관리 도구 검토를 위한 참고 자료입니다.
>
> **공식 문서**: [https://docs.astral.sh/uv/](https://docs.astral.sh/uv/)

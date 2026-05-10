-- cat-meetup 초기 스키마
-- Supabase SQL Editor에서 실행하거나 supabase db push로 적용

-- ============================================================
-- 1. 지역 테이블
-- ============================================================
CREATE TABLE IF NOT EXISTS regions (
  code VARCHAR(20) PRIMARY KEY,
  city VARCHAR(50) NOT NULL,
  district VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true
);

INSERT INTO regions (code, city, district) VALUES
  ('seoul-guro', '서울시', '구로구'),
  ('seoul-gwanak', '서울시', '관악구'),
  ('seoul-nowon', '서울시', '노원구')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- 2. 사용자 테이블
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE,  -- Supabase Auth uid 매핑
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  kakao_id VARCHAR(50) UNIQUE,
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(200),  -- Supabase Auth 사용 시 불필요, 호환용
  gender VARCHAR(10) CHECK (gender IN ('남', '여', '기타')),
  birth_date DATE,
  region_code VARCHAR(20) REFERENCES regions(code),
  bio TEXT,
  trust_score INT DEFAULT 100 CHECK (trust_score >= 0 AND trust_score <= 1000),
  point_balance INT DEFAULT 0 CHECK (point_balance >= 0),
  total_points_earned INT DEFAULT 0,
  total_points_spent INT DEFAULT 0,
  score_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- ============================================================
-- 3. 고양이 카드 테이블
-- ============================================================
CREATE TABLE IF NOT EXISTS cats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  gender VARCHAR(10) CHECK (gender IN ('수컷', '암컷')),
  age_years INT CHECK (age_years >= 0),
  neutered BOOLEAN DEFAULT false,
  temperament VARCHAR(20) CHECK (temperament IN ('개냥이', '수줍음', '사나움')),
  image_url TEXT,
  description TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- 사용자당 is_primary = true는 최대 1개
CREATE UNIQUE INDEX IF NOT EXISTS idx_cats_primary_per_user
  ON cats (owner_user_id) WHERE is_primary = true AND deleted_at IS NULL;

-- ============================================================
-- 4. 게시물 테이블
-- ============================================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_user_id UUID NOT NULL REFERENCES users(id),
  region_code VARCHAR(20) REFERENCES regions(code),
  title VARCHAR(200) NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('돌봄', '친구찾기', '물품나눔')),
  meet_at TIMESTAMPTZ NOT NULL,
  content TEXT,
  status VARCHAR(20) DEFAULT '모집' CHECK (status IN ('모집', '매칭중', '매칭완료')),
  selected_application_id UUID,  -- 나중에 FK 추가
  matched_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- ============================================================
-- 5. 게시물 신청 테이블
-- ============================================================
CREATE TABLE IF NOT EXISTS post_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  applicant_user_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(20) DEFAULT '대기중' CHECK (status IN ('대기중', '매칭중', '매칭완료', '실패')),
  applicant_accepted BOOLEAN DEFAULT false,
  applicant_accepted_at TIMESTAMPTZ,
  host_phone_visible BOOLEAN DEFAULT false,
  applicant_phone_visible BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE (post_id, applicant_user_id)  -- 동일 게시물 중복 신청 금지
);

-- FK: posts.selected_application_id -> post_applications.id
ALTER TABLE posts
  ADD CONSTRAINT fk_posts_selected_application
  FOREIGN KEY (selected_application_id) REFERENCES post_applications(id);

-- ============================================================
-- 6. 매칭 선택 변경 로그
-- ============================================================
CREATE TABLE IF NOT EXISTS match_selection_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES post_applications(id),
  post_id UUID NOT NULL REFERENCES posts(id),
  actor_user_id UUID NOT NULL REFERENCES users(id),
  action_type VARCHAR(20) NOT NULL CHECK (action_type IN ('selection', 'reselection', 'cancel')),
  before_status VARCHAR(20),
  after_status VARCHAR(20),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 7. 리뷰 테이블
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id),
  reviewer_user_id UUID NOT NULL REFERENCES users(id),
  reviewee_user_id UUID NOT NULL REFERENCES users(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  available_from TIMESTAMPTZ NOT NULL,  -- meet_at + 1일
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- ============================================================
-- 8. 포인트 거래 내역
-- ============================================================
CREATE TABLE IF NOT EXISTS point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  amount INT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('적립', '사용', '차감', '보정')),
  reason VARCHAR(200),
  ref_post_id UUID REFERENCES posts(id),
  ref_review_id UUID REFERENCES reviews(id),
  balance_after INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 9. 추천 인덱스
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_posts_filter
  ON posts (region_code, category, status, meet_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_applications_by_post
  ON post_applications (post_id, status)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_applications_by_user
  ON post_applications (applicant_user_id, status, created_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_reviews_by_reviewee
  ON reviews (reviewee_user_id, created_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_users_trust_score
  ON users (trust_score DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_point_tx_by_user
  ON point_transactions (user_id, created_at DESC);

-- ============================================================
-- 10. updated_at 자동 갱신 트리거
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_cats_updated_at
  BEFORE UPDATE ON cats FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_posts_updated_at
  BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_applications_updated_at
  BEFORE UPDATE ON post_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_reviews_updated_at
  BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 11. RLS (Row Level Security) 기본 정책
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cats ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_selection_logs ENABLE ROW LEVEL SECURITY;

-- 로그인한 사용자는 모든 게시물/지역 조회 가능
CREATE POLICY "regions_read" ON regions FOR SELECT USING (true);

CREATE POLICY "posts_read" ON posts FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "posts_insert" ON posts FOR INSERT
  WITH CHECK (author_user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "posts_update_own" ON posts FOR UPDATE
  USING (author_user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

-- 사용자: 본인 정보만 수정, 조회는 모두 가능
CREATE POLICY "users_read" ON users FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "users_insert" ON users FOR INSERT
  WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "users_update_own" ON users FOR UPDATE
  USING (auth_user_id = auth.uid());

-- 고양이: 본인 것만 CRUD, 조회는 모두 가능
CREATE POLICY "cats_read" ON cats FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "cats_insert" ON cats FOR INSERT
  WITH CHECK (owner_user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "cats_update_own" ON cats FOR UPDATE
  USING (owner_user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

-- 신청: 본인 신청만 생성, 조회는 관련자
CREATE POLICY "applications_read" ON post_applications FOR SELECT
  USING (deleted_at IS NULL);

CREATE POLICY "applications_insert" ON post_applications FOR INSERT
  WITH CHECK (applicant_user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

-- 리뷰: 본인 작성만 생성, 조회는 모두
CREATE POLICY "reviews_read" ON reviews FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "reviews_insert" ON reviews FOR INSERT
  WITH CHECK (reviewer_user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

-- 포인트: 본인 것만 조회
CREATE POLICY "points_read_own" ON point_transactions FOR SELECT
  USING (user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

-- 매칭 로그: 관련자만 조회
CREATE POLICY "match_logs_read" ON match_selection_logs FOR SELECT
  USING (actor_user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

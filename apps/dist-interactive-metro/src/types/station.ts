/**
 * 역 정보 타입 (최소 정의, API 연동 시 확장)
 */
export interface Station {
  id: string
  name: string
  nameEn?: string
  lineIds?: string[]
  stationNumber?: string
}

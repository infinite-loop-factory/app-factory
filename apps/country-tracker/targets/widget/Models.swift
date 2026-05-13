import Foundation

struct WidgetSnapshot: Codable {
    let totalCountries: Int
    let totalDays: Int
    let recent: [RecentCountry]
    let updatedAt: String

    static let empty = WidgetSnapshot(
        totalCountries: 0,
        totalDays: 0,
        recent: [],
        updatedAt: ""
    )
}

struct RecentCountry: Codable, Identifiable {
    let code: String
    let flag: String
    let name: String
    let days: Int

    var id: String { code }
}

import SwiftUI
import WidgetKit

struct CountryWidget: Widget {
    let kind: String = "CountryWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: CountryProvider()) { entry in
            CountryWidgetView(entry: entry)
        }
        .configurationDisplayName("Country Tracker")
        .description("최근 방문국가")
        .supportedFamilies([.systemSmall])
    }
}

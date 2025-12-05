export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const start = searchParams.get("start") // Should be longitude,latitude
    const end = searchParams.get("end")

    if (!start || !end) {
      console.error("[v0] Missing coordinates")
      return Response.json({ error: "Missing coordinates" }, { status: 400 })
    }

    console.log("[v0] Requested route from", start, "to", end)

    const osmUrl = `https://router.project-osrm.org/route/v1/foot/${start};${end}?overview=full&geometries=geojson`
    console.log("[v0] OSRM URL:", osmUrl)

    const response = await fetch(osmUrl)

    if (!response.ok) {
      console.error(`[v0] OSRM API error: ${response.status}`)
      return Response.json({ error: `OSRM API error: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    console.log("[v0] OSRM response routes count:", data.routes?.length)
    return Response.json(data)
  } catch (error) {
    console.error("[v0] Route API error:", error)
    return Response.json({ error: "Failed to fetch route" }, { status: 500 })
  }
}

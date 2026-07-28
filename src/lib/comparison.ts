/**
 * Destination Comparison Engine
 * Aggregates data from multiple sources to compare countries/cities
 */

import { db } from '@/db'
import { countries, cities, visaRequirements } from '@/db/schema'
import { eq, and, inArray } from 'drizzle-orm'

export interface ComparisonMetric {
  label: string
  value: string | number
  icon?: string
  color?: 'green' | 'yellow' | 'red' | 'neutral'
}

export interface DestinationComparison {
  slug: string
  name: string
  type: 'country' | 'city'
  metrics: Record<string, ComparisonMetric>
  image?: string
}

/**
 * Get comparison data for countries
 */
export async function compareCountries(slugs: string[]): Promise<DestinationComparison[]> {
  try {
    const countryData = await db
      .select()
      .from(countries)
      .where(inArray(countries.slug, slugs))

    const visaData = await db
      .select()
      .from(visaRequirements)
      .where(inArray(visaRequirements.destinationCountryId, countryData.map((c) => c.id)))

    return countryData.map((country) => {
      const visas = visaData.filter((v) => v.destinationCountryId === country.id)
      const requiresVisa = visas.some((v) => v.visaRequired === true)
      const visaFreeCount = visas.filter((v) => v.visaRequired === false).length

      return {
        slug: country.slug,
        name: country.name,
        type: 'country',
        image: country.imageUrl || undefined,
        metrics: {
          population: {
            label: 'Population',
            value: country.population ? formatNumber(country.population) : 'N/A',
          },
          area: {
            label: 'Area',
            value: country.areaKm2 ? `${formatNumber(country.areaKm2)} km²` : 'N/A',
          },
          timezone: {
            label: 'Timezone',
            value: country.timezoneName || 'Multiple',
          },
          language: {
            label: 'Official Language',
            value: country.mainLanguage || 'N/A',
          },
          currency: {
            label: 'Currency',
            value: country.currencyCode || 'N/A',
          },
          gdp: {
            label: 'GDP per Capita',
            value: country.gdpPerCapita ? `$${country.gdpPerCapita.toLocaleString()}` : 'N/A',
          },
          visaFree: {
            label: 'Visa-Free Access',
            value: `${visaFreeCount} countries`,
            color: visaFreeCount > 100 ? 'green' : visaFreeCount > 50 ? 'yellow' : 'red',
          },
          requiresVisa: {
            label: 'Visa Required',
            value: requiresVisa ? 'Some countries' : 'Few/None',
            color: requiresVisa ? 'yellow' : 'green',
          },
          climate: {
            label: 'Climate Type',
            value: country.climateType || 'Varied',
          },
          bestTime: {
            label: 'Best Time to Visit',
            value: country.bestTimeToVisit || 'Year-round',
          },
          safetyRating: {
            label: 'Safety Rating',
            value: country.safetyIndex ? `${(country.safetyIndex * 100).toFixed(0)}%` : 'N/A',
            color: (country.safetyIndex || 0) > 0.7 ? 'green' : (country.safetyIndex || 0) > 0.5 ? 'yellow' : 'red',
          },
        },
      }
    })
  } catch (error) {
    console.error('[Comparison] Error comparing countries:', error)
    return []
  }
}

/**
 * Get comparison data for cities
 */
export async function compareCities(slugs: string[]): Promise<DestinationComparison[]> {
  try {
    const cityData = await db
      .select()
      .from(cities)
      .where(inArray(cities.slug, slugs))

    return cityData.map((city) => ({
      slug: city.slug,
      name: city.name,
      type: 'city',
      image: city.imageUrl || undefined,
      metrics: {
        country: {
          label: 'Country',
          value: city.country || 'N/A',
        },
        population: {
          label: 'Population',
          value: city.population ? formatNumber(city.population) : 'N/A',
        },
        timezone: {
          label: 'Timezone',
          value: city.timezone || 'N/A',
        },
        coordinates: {
          label: 'Coordinates',
          value: `${city.latitude?.toFixed(2)}°, ${city.longitude?.toFixed(2)}°`,
        },
        elevation: {
          label: 'Elevation',
          value: city.elevationMeters ? `${city.elevationMeters}m` : 'Sea level',
        },
        climate: {
          label: 'Climate',
          value: city.climateType || 'Temperate',
        },
        language: {
          label: 'Main Language',
          value: city.mainLanguage || 'English',
        },
        currency: {
          label: 'Currency',
          value: city.currencyCode || 'Local',
        },
      },
    }))
  } catch (error) {
    console.error('[Comparison] Error comparing cities:', error)
    return []
  }
}

/**
 * Mix countries and cities in comparison
 */
export async function compareDestinations(
  slugs: string[],
  types?: ('country' | 'city')[]
): Promise<DestinationComparison[]> {
  const countries_list = await compareCountries(slugs)
  const cities_list = await compareCities(slugs)

  let results = [...countries_list, ...cities_list].filter((d) => slugs.includes(d.slug))

  if (types) {
    results = results.filter((d) => types.includes(d.type))
  }

  return results
}

/**
 * Helper: Format large numbers
 */
function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`
  }
  return num.toFixed(0)
}

/**
 * Get comparison insights (text summary)
 */
export function getComparisonInsights(
  comparisons: DestinationComparison[],
  metric: string
): string {
  if (comparisons.length < 2) return ''

  const values = comparisons
    .map((c) => ({
      name: c.name,
      value: c.metrics[metric]?.value,
    }))
    .filter((v) => v.value !== undefined)

  if (values.length === 0) return ''

  // Generate text insights based on metric
  switch (metric) {
    case 'population':
      const populations = values
        .map((v) => ({ name: v.name, value: parseInt(String(v.value).replace(/[^0-9]/g, '')) }))
        .sort((a, b) => b.value - a.value)
      return `${populations[0].name} is the most populous with ${populations[0].value.toLocaleString()} people.`

    case 'safetyRating':
      const safest = values
        .map((v) => ({ name: v.name, value: parseInt(String(v.value)) }))
        .sort((a, b) => b.value - a.value)[0]
      return `${safest.name} has the highest safety rating at ${safest.value}%.`

    case 'visaFree':
      const mostVisa = values
        .map((v) => ({ name: v.name, value: parseInt(String(v.value)) }))
        .sort((a, b) => b.value - a.value)[0]
      return `${mostVisa.name} offers visa-free access to the most countries (${mostVisa.value}).`

    default:
      return ''
  }
}

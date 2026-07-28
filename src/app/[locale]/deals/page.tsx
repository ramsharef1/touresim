export const metadata = {
  title: 'Travel Deals',
  description: 'Best travel deals from top partners including flights, hotels, tours, and activities',
}

export default function DealsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-4xl font-bold mb-2">Travel Deals</h1>
          <p className="text-lg text-blue-100">Best travel deals updated daily</p>
        </div>
      </div>

      {/* Type Filters */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <a href="/deals" className="whitespace-nowrap px-4 py-2 rounded-full font-medium bg-blue-600 text-white shadow-md">All</a>
          <a href="/deals?type=flight" className="whitespace-nowrap px-4 py-2 rounded-full font-medium bg-white text-gray-700 hover:bg-gray-100">Flights</a>
          <a href="/deals?type=hotel" className="whitespace-nowrap px-4 py-2 rounded-full font-medium bg-white text-gray-700 hover:bg-gray-100">Hotels</a>
          <a href="/deals?type=tour" className="whitespace-nowrap px-4 py-2 rounded-full font-medium bg-white text-gray-700 hover:bg-gray-100">Tours</a>
          <a href="/deals?type=activity" className="whitespace-nowrap px-4 py-2 rounded-full font-medium bg-white text-gray-700 hover:bg-gray-100">Activities</a>
          <a href="/deals?type=experience" className="whitespace-nowrap px-4 py-2 rounded-full font-medium bg-white text-gray-700 hover:bg-gray-100">Experiences</a>
        </div>

        {/* Deals Container (Client-side loading) */}
        <div id="deals-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-full text-center py-12 text-gray-600">Loading deals...</div>
        </div>
      </div>

      {/* Client Script to Load Deals */}
      <script dangerouslySetInnerHTML={{__html: `
        (async () => {
          try {
            const params = new URLSearchParams(window.location.search);
            const type = params.get('type');
            const url = '/api/deals' + (type ? '?type=' + type : '');

            const res = await fetch(url);
            const data = await res.json();

            const container = document.getElementById('deals-container');
            if (!data.data || data.data.length === 0) {
              container.innerHTML = '<div class="col-span-full text-center py-12 text-gray-500">No deals available</div>';
              return;
            }

            container.innerHTML = data.data.map(deal => \`
              <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                  <h3 class="font-semibold text-lg">\${deal.title}</h3>
                  <p class="text-sm text-blue-100">\${deal.partner}</p>
                </div>
                <div class="p-4">
                  <p class="text-gray-600 text-sm mb-2">\${deal.description}</p>
                  <div class="flex justify-between items-center mb-4">
                    <div>
                      <span class="text-2xl font-bold text-blue-600">$\${deal.dealPrice}</span>
                      <span class="text-gray-500 line-through text-sm ml-2">$\${deal.originalPrice}</span>
                    </div>
                    <span class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">-\${deal.discount}%</span>
                  </div>
                  <p class="text-xs text-gray-500 mb-3">Expires: \${new Date(deal.expiresAt).toLocaleDateString()}</p>
                  <a href="\${deal.affiliateUrl}" target="_blank" rel="noopener noreferrer" class="block w-full bg-blue-600 text-white py-2 rounded-lg text-center font-medium hover:bg-blue-700">
                    View Deal
                  </a>
                </div>
              </div>
            \`).join('');
          } catch (error) {
            console.error('Error loading deals:', error);
            document.getElementById('deals-container').innerHTML = '<div class="col-span-full text-center py-12 text-red-600">Error loading deals</div>';
          }
        })();
      `}} />
    </main>
  )
}

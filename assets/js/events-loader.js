// ==========================================================
// SERVEKERALA.IN – EVENTS ENGINE & LOCAL DIRECTORY LOADER
// ==========================================================

(function() {
  'use strict';

  // Seed Events for Central Travancore / Kerala
  const SEED_EVENTS = [
    {
      id: 'central-travancore-flower-show-2026',
      slug: 'central-travancore-flower-show-2026',
      title: 'Central Travancore Flower Show & Agri Expo 2026',
      category: 'expo',
      categoryLabel: '🛍️ Expo & Fair',
      district: 'Pathanamthitta',
      town: 'Thiruvalla',
      venue: 'Municipal Stadium Grounds, Thiruvalla',
      startDate: '2026-12-18',
      endDate: '2026-12-25',
      time: '10:00 AM – 9:00 PM',
      entryType: '₹30 Entry Fee',
      organizer: 'Agri-Horticultural Society & Municipal Council',
      contactPhone: '9447123450',
      contactWhatsApp: '9447123450',
      posterUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
      description: 'The premier annual gardening and agriculture exhibition of Central Travancore. Over 100,000 exotic flowers, ornamental plants, bonsai displays, organic farming tech, nursery stalls, and a family food court featuring traditional Kerala snacks.',
      isFeatured: true,
      tags: ['flower show', 'thiruvalla', 'agri expo', 'shopping', 'plants']
    },
    {
      id: 'kottayam-mega-shopping-and-trade-expo',
      slug: 'kottayam-mega-shopping-and-trade-expo',
      title: 'Kottayam Mega Shopping & Consumer Trade Fair',
      category: 'expo',
      categoryLabel: '🛍️ Expo & Fair',
      district: 'Kottayam',
      town: 'Kottayam',
      venue: 'Mammen Mappillai Hall, Kottayam Town',
      startDate: '2026-12-05',
      endDate: '2026-12-14',
      time: '11:00 AM – 9:00 PM',
      entryType: 'Free Entry',
      organizer: 'Kerala Merchants Chamber',
      contactPhone: '9847198765',
      contactWhatsApp: '9847198765',
      posterUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      description: 'Grand shopping festival bringing together 150+ regional exhibitors: home appliances, Malabar handloom, customized furniture, electronic gadgets, handicrafts, and live stage entertainment every evening.',
      isFeatured: true,
      tags: ['kottayam', 'trade fair', 'shopping', 'furniture expo']
    },
    {
      id: 'maramon-convention-2027',
      slug: 'maramon-convention-2027',
      title: 'Maramon Convention 2027 (132nd Gathering)',
      category: 'festival',
      categoryLabel: '🎪 Festival & Gathering',
      district: 'Pathanamthitta',
      town: 'Kozhencherry',
      venue: 'Pamba River Sandbed, Maramon near Kozhencherry',
      startDate: '2027-02-14',
      endDate: '2027-02-21',
      time: '9:30 AM & 2:30 PM & 6:00 PM',
      entryType: 'Free Entry / Open to All',
      organizer: 'Mar Thoma Evangelistic Association',
      contactPhone: '04682224422',
      contactWhatsApp: '9447022442',
      posterUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=1200&q=80',
      description: 'Asia’s largest Christian gathering held annually on the vast dry sandbed of the holy River Pamba. Millions of delegates and visitors arrive across Kerala for community fellowship, social discourses, and spiritual sessions in the iconic thatched Pandal.',
      isFeatured: true,
      tags: ['maramon', 'kozhencherry', 'pamba', 'convention', 'pathanamthitta']
    },
    {
      id: 'alappuzha-beach-carnival-food-fest',
      slug: 'alappuzha-beach-carnival-food-fest',
      title: 'Alappuzha Beach Carnival & Seafood Festival',
      category: 'food',
      categoryLabel: '🍲 Food & Carnival',
      district: 'Alappuzha',
      town: 'Alappuzha',
      venue: 'Alappuzha Beach Promenade & Old Pier',
      startDate: '2026-12-24',
      endDate: '2027-01-02',
      time: '3:00 PM – 10:30 PM',
      entryType: 'Free Entry',
      organizer: 'District Tourism Promotion Council (DTPC)',
      contactPhone: '04772251796',
      contactWhatsApp: '9447725179',
      posterUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      description: 'Celebrate Christmas and New Year by the waves! Authentic Kuttanadan fish curry, Karimeen pollichathu, Arabian grill counters, sand art competitions, live DJ nights, and illuminated pier spectacles.',
      isFeatured: true,
      tags: ['alappuzha', 'beach fest', 'seafood', 'new year', 'food festival']
    },
    {
      id: 'kollam-fest-cultural-extravaganza',
      slug: 'kollam-fest-cultural-extravaganza',
      title: 'Kollam Fest & National Cultural Mela',
      category: 'cultural',
      categoryLabel: '🎭 Arts & Shows',
      district: 'Kollam',
      town: 'Kollam',
      venue: 'Asramam Maidan, Kollam Town',
      startDate: '2026-12-20',
      endDate: '2026-12-29',
      time: '4:00 PM – 10:00 PM',
      entryType: '₹20 Entry Fee',
      organizer: 'Kollam Municipal Corporation & Cultural Society',
      contactPhone: '04742742000',
      contactWhatsApp: '9447074200',
      posterUrl: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=1200&q=80',
      description: 'Ten days of cultural grandeur at the sprawling Asramam Maidan: national dance troupes, Sopana Sangeetham, percussion ensembles (*Panchavadyam*), traditional puppet shows, and amusement park rides for children.',
      isFeatured: false,
      tags: ['kollam', 'asramam', 'kollam fest', 'cultural show', 'ganamela']
    },
    {
      id: 'adoor-all-kerala-sevens-football-tournament',
      slug: 'adoor-all-kerala-sevens-football-tournament',
      title: 'All-Kerala Floodlit Sevens Football Tournament',
      category: 'sports',
      categoryLabel: '⚽ Sports & Games',
      district: 'Pathanamthitta',
      town: 'Adoor',
      venue: 'Adoor Municipal Stadium, Stadium Road',
      startDate: '2026-12-10',
      endDate: '2026-12-18',
      time: '7:00 PM Match Kickoff',
      entryType: '₹50 Gallery / ₹100 Chair',
      organizer: 'Adoor Youths Sports Club',
      contactPhone: '9847551122',
      contactWhatsApp: '9847551122',
      posterUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
      description: 'The electrifying craze of Kerala Sevens Football! Top clubs from Malappuram, Kozhikode, and Travancore battle it out under stadium floodlights with commentary in lively Malayalam.',
      isFeatured: false,
      tags: ['adoor', 'sevens football', 'kerala football', 'sports']
    }
  ];

  window.SK_SEED_EVENTS = SEED_EVENTS;

  let allLoadedEvents = [...SEED_EVENTS];

  // Helper to format date in clean Kerala style
  window.formatEventDateRange = function(startStr, endStr) {
    if (!startStr) return '';
    const start = new Date(startStr);
    const optionsMonth = { month: 'short' };
    const month = start.toLocaleDateString('en-US', optionsMonth).toUpperCase();
    const startDay = start.getDate();

    if (!endStr || startStr === endStr) {
      return `${month} ${startDay}, ${start.getFullYear()}`;
    }

    const end = new Date(endStr);
    if (start.getMonth() === end.getMonth()) {
      return `${month} ${startDay} – ${end.getDate()}, ${start.getFullYear()}`;
    } else {
      const endMonth = end.toLocaleDateString('en-US', optionsMonth).toUpperCase();
      return `${month} ${startDay} – ${endMonth} ${end.getDate()}, ${end.getFullYear()}`;
    }
  };

  // Helper to get day and month for date badge
  window.getEventDateBadge = function(startStr) {
    if (!startStr) return { day: '01', month: 'DEC' };
    const d = new Date(startStr);
    const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = String(d.getDate()).padStart(2, '0');
    return { day, month };
  };

  // Fetch Firestore Events
  window.loadKeralaEvents = function(callback) {
    if (typeof firebase === 'undefined' || !firebase.firestore) {
      if (callback) callback(allLoadedEvents);
      return;
    }

    const db = firebase.firestore();
    db.collection('events')
      .where('status', '==', 'approved')
      .get()
      .then(snapshot => {
        let firestoreEvents = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          firestoreEvents.push({
            id: doc.id,
            slug: data.slug || doc.id,
            ...data
          });
        });

        if (firestoreEvents.length > 0) {
          // Merge: Firestore events take precedence, seed events fill the rest
          const firestoreIds = new Set(firestoreEvents.map(e => e.slug || e.id));
          const complementarySeeds = SEED_EVENTS.filter(s => !firestoreIds.has(s.slug) && !firestoreIds.has(s.id));
          allLoadedEvents = [...firestoreEvents, ...complementarySeeds];
        } else {
          allLoadedEvents = [...SEED_EVENTS];
        }

        if (callback) callback(allLoadedEvents);
      })
      .catch(err => {
        console.warn('Could not query firestore events. Using seed events.', err);
        if (callback) callback(allLoadedEvents);
      });
  };

  // Render Event Card Component
  window.createEventCardHtml = function(event) {
    const badge = window.getEventDateBadge(event.startDate);
    const dateRangeStr = window.formatEventDateRange(event.startDate, event.endDate);
    const detailUrl = `/events/${event.slug || event.id}/`;
    const shareText = `Check out this upcoming event in ${event.town}, ${event.district}: "${event.title}" on ServeKerala: https://servekerala.in${detailUrl}`;
    const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

    const poster = event.posterUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80';

    return `
      <div class="event-card" data-district="${(event.district || '').toLowerCase()}" data-category="${event.category || 'other'}" data-start="${event.startDate || ''}">
        <div class="event-card-poster-wrap">
          <img src="${poster}" alt="${event.title}" class="event-card-poster" loading="lazy" />
          <div class="event-date-badge">
            <span class="event-date-month">${badge.month}</span>
            <span class="event-date-day">${badge.day}</span>
          </div>
          <span class="event-cat-tag">${event.categoryLabel || 'Event'}</span>
        </div>

        <div class="event-card-body">
          <div class="event-card-loc">
            <span>📍 ${event.town}, ${event.district}</span>
            ${event.entryType ? `<span class="event-entry-pill">${event.entryType}</span>` : ''}
          </div>

          <h3 class="event-card-title">
            <a href="${detailUrl}">${event.title}</a>
          </h3>

          <div class="event-meta-line">
            <span class="event-meta-icon">🗓️</span>
            <span>${dateRangeStr}</span>
          </div>
          <div class="event-meta-line">
            <span class="event-meta-icon">🏛️</span>
            <span class="truncate-venue">${event.venue}</span>
          </div>

          <div class="event-card-footer">
            <a href="${detailUrl}" class="btn-event-detail">View Details &rarr;</a>
            <a href="${waShareUrl}" target="_blank" rel="noopener" class="btn-event-share" title="Share on WhatsApp" aria-label="Share event on WhatsApp">
              💬 Share
            </a>
          </div>
        </div>
      </div>
    `;
  };

})();


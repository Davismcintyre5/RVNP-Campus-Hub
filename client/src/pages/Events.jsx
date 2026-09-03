import { useState, useEffect } from 'react';
import { IoCalendar, IoLocation } from 'react-icons/io5';
import Layout from '../components/layout/Layout.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Tabs from '../components/ui/Tabs.jsx';
import eventApi from '../api/eventApi.js';
import { formatEventDate } from '../utils/formatDate.js';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  const tabs = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
  ];

  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  const fetchEvents = async () => {
    setLoading(true);

    try {
      const response =
        activeTab === 'upcoming'
          ? await eventApi.getUpcomingEvents()
          : await eventApi.getOngoingEvents();

      if (response.data.success) {
        setEvents(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to load events:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="w-full">
        <h1 className="text-2xl font-heading font-bold text-text-primary mb-4">
          Events
        </h1>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : events.length === 0 ? (
            <EmptyState
              icon={IoCalendar}
              title={`No ${activeTab} events`}
              description="Check back later for events!"
            />
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-xl border border-border-color bg-bg-primary"
                >
                  <h3 className="font-medium text-text-primary text-lg">
                    {event.title}
                  </h3>

                  {event.description && (
                    <p className="text-text-secondary text-sm mt-1">
                      {event.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-text-muted">
                    <span className="flex items-center gap-1">
                      <IoCalendar size={14} />
                      {formatEventDate(event.startTime, event.endTime)}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <IoLocation size={14} />
                        {event.location}
                      </span>
                    )}
                  </div>

                  {event.campus && (
                    <span className="inline-block mt-2 px-2 py-1 rounded bg-bg-secondary text-xs text-text-secondary">
                      {event.campus.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Events;
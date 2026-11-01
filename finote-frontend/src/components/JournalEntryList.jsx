import { Card, CardContent, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { getActivities } from '../services/api';

const JournalEntryList = () => {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  if (!activities.length) {
    return <Card className="finote-card"><CardContent sx={{ p: 3 }}>
      <Typography color="text.secondary">Your journal is ready. Add an entry to get started.</Typography>
    </CardContent></Card>;
  }

  return (
    <div className="entry-list">
      {activities.map((activity) => (
        <Card className="finote-card entry-card" key={activity.id}
          onClick={() => navigate(`/activities/${activity.id}`)}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography className="eyebrow">{activity.createdAt ? new Date(activity.createdAt).toLocaleDateString() : 'Journal entry'}</Typography>
            <Typography variant="h6" sx={{ color: '#173b32', mt: .5 }}>{activity.type}</Typography>
            <Typography color="text.secondary" sx={{ mt: .5 }}>
              {activity.duration} minutes · {activity.caloriesBurned} calories
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default JournalEntryList

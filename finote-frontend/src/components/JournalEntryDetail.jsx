import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getActivityDetail } from '../services/api';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';

const JournalEntryDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        const response = await getActivityDetail(id);
        setActivity(response.data);
        setRecommendation(response.data.recommendation);
      } catch (error) {
        console.error(error);
      }
    }

    fetchActivityDetail();
  }, [id]);

  if (!activity) {
    return <Box className="page-content"><Typography color="text.secondary">Loading journal entry…</Typography></Box>
  }
  return (
    <Box className="page-content" sx={{ maxWidth: 850 }}>
            <Typography className="eyebrow">Journal entry</Typography>
            <Card className="finote-card" sx={{ mb: 2 }}>
                <CardContent>
                    <Typography className="section-title" variant="h5" gutterBottom>Entry details</Typography>
                    <Typography>Type: {activity.type}</Typography>
                    <Typography>Time spent: {activity.duration} minutes</Typography>
                    <Typography>Calories burned: {activity.caloriesBurned}</Typography>
                    <Typography>Date: {new Date(activity.createdAt).toLocaleString()}</Typography>
                </CardContent>
            </Card>

            {recommendation && (
                <Card className="finote-card">
                    <CardContent>
                        <Typography className="section-title" variant="h5" gutterBottom>Reflection and ideas</Typography>
                        <Typography variant="h6">Reflection</Typography>
                        <Typography paragraph>{activity.recommendation}</Typography>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="h6">Ideas to consider</Typography>
                        {activity?.improvements?.map((improvement, index) => (
                            <Typography key={index} paragraph>• {activity.improvements}</Typography>
                        ))}
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="h6">Suggestions</Typography>
                        {activity?.suggestions?.map((suggestion, index) => (
                            <Typography key={index} paragraph>• {suggestion}</Typography>
                        ))}
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="h6">Helpful reminders</Typography>
                        {activity?.safety?.map((safety, index) => (
                            <Typography key={index} paragraph>• {safety}</Typography>
                        ))}
                    </CardContent>
                </Card>
            )}
        </Box>
  )
}

export default JournalEntryDetail

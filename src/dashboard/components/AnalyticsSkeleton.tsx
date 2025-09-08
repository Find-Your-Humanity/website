import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Grid,
} from '@mui/material';

const AnalyticsSkeleton: React.FC = () => {
  return (
    <Box>
      {/* 헤더 스켈레톤 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width={300} height={24} />
        </Box>
        <Skeleton variant="rectangular" width={150} height={56} />
      </Box>

      {/* API 사용량 제한 스켈레톤 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="text" width={180} height={32} />
            <Skeleton variant="rectangular" width={120} height={32} />
          </Box>
          <Grid container spacing={3}>
            {[1, 2, 3].map((i) => (
              <Grid item xs={12} md={4} key={i}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Skeleton variant="text" width={100} height={20} />
                    <Skeleton variant="text" width={80} height={20} />
                  </Box>
                  <Skeleton variant="rectangular" width="100%" height={8} sx={{ borderRadius: 4 }} />
                  <Skeleton variant="text" width={120} height={16} sx={{ mt: 0.5 }} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* 차트 스켈레톤 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Skeleton variant="text" width={180} height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={400} />
        </CardContent>
      </Card>

      {/* 성능/통계 스켈레톤 */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width={120} height={32} sx={{ mb: 2 }} />
              <Box sx={{ mt: 2 }}>
                {[1, 2, 3, 4].map((i) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Skeleton variant="text" width={120} height={20} />
                    <Skeleton variant="text" width={80} height={20} />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width={120} height={32} sx={{ mb: 2 }} />
              <Box sx={{ mt: 2 }}>
                {[1, 2, 3, 4].map((i) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Skeleton variant="text" width={120} height={20} />
                    <Skeleton variant="text" width={80} height={20} />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsSkeleton;

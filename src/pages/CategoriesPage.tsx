import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Typography, List, ListItem, ListItemText, Chip, Divider, CircularProgress,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { fetchCategories } from '../store';
import type { AppDispatch, RootState } from '../store';

export default function CategoriesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((s: RootState) => s.categories);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  const parents = items.filter(c => c.parentId === null);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Categories ({items.length})</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {parents.map(parent => {
          const children = items.filter(c => c.parentId === parent.id);
          return (
            <Card key={parent.id}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <FolderIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h6">{parent.name}</Typography>
                  <Chip label={`${children.length} subcategories`} size="small" sx={{ ml: 'auto' }} />
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{parent.description}</Typography>
                <Divider sx={{ mb: 1 }} />
                <List dense disablePadding>
                  {children.map(child => (
                    <ListItem key={child.id} sx={{ pl: 2 }}>
                      <SubdirectoryArrowRightIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <ListItemText primary={child.name} secondary={child.description} slotProps={{ primary: { sx: { fontSize: 14 } }, secondary: { sx: { fontSize: 12 } } }} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}

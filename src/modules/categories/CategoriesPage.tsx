import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, CardContent, Typography, Chip, Divider, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { fetchCategories } from '../../store';
import type { AppDispatch, RootState } from '../../store';
import { useI18n } from '../../core/i18n';

export default function CategoriesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((s: RootState) => s.categories);
  const { t } = useI18n();

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);
  const parents = items.filter(c => c.parentId === null);
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>{t.nav.categories} ({items.length})</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
        {parents.map(parent => {
          const children = items.filter(c => c.parentId === parent.id);
          return (
            <Card key={parent.id}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <FolderIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{parent.name}</Typography>
                  <Chip label={`${children.length}`} size="small" sx={{ ml: 'auto', fontSize: 11 }} />
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5, fontSize: 12.5 }}>{parent.description}</Typography>
                <Divider sx={{ mb: 1 }} />
                <List dense disablePadding>
                  {children.map(child => (
                    <ListItem key={child.id} sx={{ pl: 1 }}>
                      <SubdirectoryArrowRightIcon sx={{ fontSize: 14, mr: 1, color: 'text.secondary' }} />
                      <ListItemText primary={child.name} slotProps={{ primary: { sx: { fontSize: 13 } } }} />
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

import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function MarkerContent({camera}) {
    return (
        <Card>
            {camera.url_type === 'youtube' ?
                <iframe width="480" height="270"
                        src={`https://www.youtube.com/embed/${camera.url.split('=').at(-1)}?autoplay=1`}
                        title="Camera cổng trường Nguyễn Huệ Đà Nẵng" frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen></iframe>
                : null
            }

            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {camera.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {camera.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Xem thực tế</Button>
                <Button size="small">Dữ liệu</Button>
            </CardActions>
        </Card>
    );
}
import { Box, Grid, Typography } from "@mui/material";

export default function Message01() {
  const Data = [
    { label: "住所", value: "石川県金沢市みずき1丁目3-5" },
    { label: "最寄バス停", value: "みずき団地口バス停 正面" },
    { label: "駐車場", value: "有" },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", lineHeight: 0.8 }}>
      {/* Google Map 埋め込み */}
      <Box
        sx={{
          mt: 2,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 2,
        }}
      >
        <iframe
          title="map"
          width="100%"
          height="400"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src="https://www.google.com/maps?q=石川県金沢市みずき1丁目3-5&output=embed"
        ></iframe>
      </Box>
      <br />
      <Box sx={{ borderTop: "1px solid #ddd" }}>
        {/* 一般情報 */}
        {Data.map((row, index) => (
          <Grid
            container
            key={index}
            sx={{
              py: 1.5,
              px: 2,
              borderBottom: index === Data.length - 1 ? "none" : "1px solid #ddd",
            }}
          >
            <Grid item xs={3}>
              <Typography variant="body1">
                {row.label}
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body1">{row.value}</Typography>
            </Grid>
          </Grid>
        ))}
      </Box>
    </Box>
  );
}

import {
  Box,
  Typography,
  Stack,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import PhoneIcon from "@mui/icons-material/Phone";

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        py: 2,
        borderBottom: "1px solid #eee",
        "&:last-child": { borderBottom: "none" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: "#e8f4f6",
          flexShrink: 0,
          mt: 0.3,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color: "#2a7d8f", mb: 0.3 }}
        >
          {label}
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#333" }}>
          {children}
        </Typography>
      </Box>
    </Box>
  );
}

export default function Message01() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      {/* Google Map */}
      <Box
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 2,
          mb: 3,
        }}
      >
        <iframe
          title="みずきクリニック所在地"
          width="100%"
          height="350"
          style={{ border: 0, display: "block" }}
          loading="lazy"
          allowFullScreen
          src="https://www.google.com/maps?q=石川県金沢市みずき1丁目3-5&output=embed"
        ></iframe>
      </Box>

      {/* 情報セクション */}
      <Box
        sx={{
          backgroundColor: "#fafafa",
          borderRadius: 2,
          p: { xs: 2, sm: 3 },
          boxShadow: 1,
        }}
      >
        <Stack spacing={0}>
          <InfoRow
            icon={<LocationOnIcon sx={{ color: "#2a7d8f", fontSize: 22 }} />}
            label="所在地"
          >
            〒921-8801<br />
            石川県金沢市みずき1丁目3-5
          </InfoRow>

          <InfoRow
            icon={<PhoneIcon sx={{ color: "#2a7d8f", fontSize: 22 }} />}
            label="電話番号"
          >
            076-274-2537
          </InfoRow>

          <InfoRow
            icon={<DirectionsBusIcon sx={{ color: "#2a7d8f", fontSize: 22 }} />}
            label="バスでお越しの方"
          >
            北陸鉄道バス「みずき団地口」バス停下車、正面すぐ
          </InfoRow>

          <InfoRow
            icon={<DirectionsCarIcon sx={{ color: "#2a7d8f", fontSize: 22 }} />}
            label="お車でお越しの方"
          >
            金沢西インターチェンジより約10分<br />
            県道25号線（金沢美川小松線）沿い
          </InfoRow>

          <InfoRow
            icon={<LocalParkingIcon sx={{ color: "#2a7d8f", fontSize: 22 }} />}
            label="駐車場"
          >
            クリニック前に専用駐車場あり（無料）
          </InfoRow>
        </Stack>
      </Box>
    </Box>
  );
}

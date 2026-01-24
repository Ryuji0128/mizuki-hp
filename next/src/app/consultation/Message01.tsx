import { Box, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

export default function ConsultationHours() {
  const days = ["月", "火", "水", "木", "金", "土"];
  const morningSymbols = ["○", "○", "○", "○", "○", "○"];
  const afternoonSymbols = ["○", "○", "休", "○", "○", "休"];

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 0 }}>
      <TableContainer
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Table sx={{ borderCollapse: "collapse" }}>
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#2a7d8f",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  py: 1.5,
                  borderBottom: "none",
                }}
              >
                診療時間
              </TableCell>
              {days.map((day, i) => (
                <TableCell
                  key={day}
                  align="center"
                  sx={{
                    backgroundColor: "#2a7d8f",
                    color: day === "土" ? "#ffd54f" : "#fff",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    py: 1.5,
                    borderBottom: "none",
                    borderLeft: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  backgroundColor: "#f0f9fb",
                  whiteSpace: "nowrap",
                  py: 2,
                  borderBottom: "1px solid #e0eff3",
                }}
              >
                9:00 – 12:30
              </TableCell>
              {morningSymbols.map((symbol, i) => (
                <TableCell
                  key={i}
                  align="center"
                  sx={{
                    backgroundColor: "#f0f9fb",
                    py: 2,
                    borderLeft: "1px solid #e0eff3",
                    borderBottom: "1px solid #e0eff3",
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      backgroundColor: "#4caf50",
                      mx: "auto",
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>

            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  backgroundColor: "#fff",
                  whiteSpace: "nowrap",
                  py: 2,
                  borderBottom: "none",
                }}
              >
                16:00 – 18:00
              </TableCell>
              {afternoonSymbols.map((symbol, i) => (
                <TableCell
                  key={i}
                  align="center"
                  sx={{
                    backgroundColor: "#fff",
                    py: 2,
                    borderLeft: "1px solid #e0eff3",
                    borderBottom: "none",
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      backgroundColor: symbol === "休" ? "#ef5350" : "#4caf50",
                      mx: "auto",
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box sx={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#4caf50" }} />
          <Typography variant="caption" color="text.secondary">診療</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box sx={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#ef5350" }} />
          <Typography variant="caption" color="text.secondary">休診</Typography>
        </Box>
      </Box>

      <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", fontWeight: 500 }}>
        ※ 休診日：水曜午後・土曜午後、日曜、祝日<br />
        <Box component="span" sx={{ color: "#e53935" }}>※ 受付は診療終了30分前までにお願いします。</Box>
      </Typography>

      <Typography variant="body2" sx={{ mt: 2, lineHeight: 2, color: "text.primary" }}>
        当院では、出来るだけ多くの方に検査を受けていただけるように土曜日も検査が可能です。<br />
        内視鏡検査をご希望の方は、ネットもしくはお電話にてご予約ください。<br />
        ➡ ネットからのご予約は
        <Link
          href="https://reserva.be/kimuraowarichoclinic?simple=1"
          underline="hover"
          color="primary"
          fontWeight="bold"
          target="_blank"
          rel="noopener"
        >
          こちら
        </Link>
        <br /><br />
        尚、紹介状をお持ちの方は保険証と一緒に受付窓口にお出しください。
      </Typography>
    </Box>
  );
}






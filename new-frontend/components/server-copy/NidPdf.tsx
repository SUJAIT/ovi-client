// "use client"

// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   pdf,
// } from "@react-pdf/renderer"

// // ── Custom font ছাড়া — react-pdf built-in Helvetica use করব ──────
// // বাংলা text গুলো transliteration বা unicode হিসেবে render হবে

// type NidData = {
//   name: string
//   nameEn: string
//   nid: string
//   pin: string
//   dob: string
//   father: string
//   mother: string
//   spouse: string
//   bloodGroup: string
//   gender: string
//   birthPlace: string
//   religion: string
//   voterNo: string
//   slNo: number
//   voterArea: string
//   voterAreaCode: number
//   preAddressLine: string
//   perAddressLine: string
//   photo: string
//   photoBase64?: string
// }

// const s = StyleSheet.create({
//   page: {
//     backgroundColor: "#fff",
//     fontSize: 10,
//     color: "#000",
//     padding: 24,
//     fontFamily: "Helvetica",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     borderBottomWidth: 2,
//     borderBottomColor: "#000",
//     paddingBottom: 10,
//     marginBottom: 14,
//   },
//   logoBox: {
//     width: 50,
//     height: 50,
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//     backgroundColor: "#f3f4f6",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   logoText: { fontSize: 7, color: "#6b7280", textAlign: "center" },
//   headerText: { alignItems: "center", flex: 1 },
//   headerTitle: { fontSize: 16, fontWeight: "bold", color: "#000", textAlign: "center", fontFamily: "Helvetica-Bold" },
//   headerSub: { fontSize: 10, color: "#dc2626", textAlign: "center", marginTop: 2, fontFamily: "Helvetica-Bold" },
//   body: { flexDirection: "row", gap: 12, marginBottom: 10 },
//   leftCol: { width: 105, alignItems: "center" },
//   photoBox: {
//     width: 95,
//     height: 115,
//     borderWidth: 1,
//     borderColor: "#9ca3af",
//     backgroundColor: "#f3f4f6",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 5,
//   },
//   photoText: { fontSize: 8, color: "#6b7280" },
//   photoName: { fontSize: 8, fontFamily: "Helvetica-Bold", textAlign: "center", marginBottom: 5 },
//   qrBox: {
//     width: 65,
//     height: 65,
//     borderWidth: 1,
//     borderColor: "#000",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   rightCol: { flex: 1 },
//   tbl: { marginBottom: 7 },
//   sh: {
//     backgroundColor: "#bfdbfe",
//     padding: 5,
//     fontFamily: "Helvetica-Bold",
//     fontSize: 9,
//     borderWidth: 1,
//     borderColor: "#93c5fd",
//   },
//   row: { flexDirection: "row" },
//   lb: {
//     width: "46%",
//     padding: 4,
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//     backgroundColor: "#f9fafb",
//     fontSize: 8.5,
//     lineHeight: 1.4,
//   },
//   vl: {
//     flex: 1,
//     padding: 4,
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//     fontSize: 8.5,
//     lineHeight: 1.4,
//   },
//   vlBold: {
//     flex: 1,
//     padding: 4,
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//     fontSize: 8.5,
//     fontFamily: "Helvetica-Bold",
//     lineHeight: 1.4,
//   },
//   addr: {
//     padding: 5,
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//     fontSize: 8.5,
//     lineHeight: 1.6,
//   },
//   footer: {
//     borderTopWidth: 1,
//     borderTopColor: "#e5e7eb",
//     paddingTop: 8,
//     alignItems: "center",
//     marginTop: 8,
//   },
//   footerRed: { fontSize: 7.5, color: "#dc2626", textAlign: "center", marginBottom: 3 },
//   footerBlk: { fontSize: 7.5, color: "#374151", textAlign: "center" },
// })

// function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
//   return (
//     <View style={s.row}>
//       <Text style={s.lb}>{label}</Text>
//       <Text style={bold ? s.vlBold : s.vl}>{value || "N/A"}</Text>
//     </View>
//   )
// }

// function NidDocument({ data }: { data: NidData }) {
//   return (
//     <Document>
//       <Page size="A4" style={s.page}>

//         {/* Header */}
//         <View style={s.header}>
//           <View style={s.logoBox}>
//             <Text style={s.logoText}>EC{"\n"}LOGO</Text>
//           </View>
//           <View style={s.headerText}>
//             <Text style={s.headerTitle}>Bangladesh Election Commission</Text>
//             <Text style={s.headerSub}>National Identity Registration Wing (NIDW)</Text>
//           </View>
//         </View>

//         {/* Body */}
//         <View style={s.body}>

//           {/* Left */}
//           <View style={s.leftCol}>
//             <View style={s.photoBox}>
//               <Text style={s.photoText}>Photo</Text>
//             </View>
//             <Text style={s.photoName}>{data.nameEn}</Text>
//             <View style={s.qrBox}>
//               <Text style={{ fontSize: 7, color: "#6b7280" }}>QR Code</Text>
//             </View>
//           </View>

//           {/* Right */}
//           <View style={s.rightCol}>
//             <View style={s.tbl}>
//               <Text style={s.sh}>জাতীয় পরিচিতি তথ্য</Text>
//               <Row label="জাতীয় পরিচয় পত্র নম্বর" value={data.nid} />
//               <Row label="পিন নম্বর" value={data.pin} />
//               <Row label="ভোটার নম্বর" value={data.voterNo} />
//               <Row label="সিরিয়াল নম্বর" value={String(data.slNo)} />
//               <Row label="ভোটার এলাকা নম্বর" value={String(data.voterAreaCode)} />
//             </View>
//             <View style={s.tbl}>
//               <Text style={s.sh}>ব্যক্তিগত তথ্য</Text>
//               <Row label="নাম (বাংলা)" value={data.name} bold />
//               <Row label="নাম (ইংরেজি)" value={data.nameEn} />
//               <Row label="জন্ম তারিখ" value={data.dob} />
//               <Row label="পিতার নাম" value={data.father} />
//               <Row label="মাতার নাম" value={data.mother} />
//               <Row label="স্বামী / স্ত্রীর নাম" value={data.spouse} />
//             </View>
//           </View>
//         </View>

//         {/* অন্যান্য তথ্য */}
//         <View style={s.tbl}>
//           <Text style={s.sh}>অন্যান্য তথ্য</Text>
//           <Row label="লিঙ্গ" value={data.gender === "male" ? "male" : "female"} />
//           <Row label="ধর্ম" value={data.religion} />
//           <Row label="জন্মস্থান" value={data.birthPlace} />
//           <Row label="রক্তের গ্রুপ" value={data.bloodGroup || "N/A"} />
//         </View>

//         {/* বর্তমান ঠিকানা */}
//         <View style={s.tbl}>
//           <Text style={s.sh}>বর্তমান ঠিকানা</Text>
//           <Text style={s.addr}>{data.preAddressLine}</Text>
//         </View>

//         {/* স্থায়ী ঠিকানা */}
//         <View style={[s.tbl, { marginBottom: 12 }]}>
//           <Text style={s.sh}>স্থায়ী ঠিকানা</Text>
//           <Text style={s.addr}>{data.perAddressLine}</Text>
//         </View>

//         {/* Footer */}
//         <View style={s.footer}>
//           <Text style={s.footerRed}>
//             উপরে প্রদর্শিত তথ্যসমূহ জাতীয় পরিচয়পত্র সংশ্লিষ্ট, ভোটার তালিকার সাথে সরাসরি সম্পর্কযুক্ত নয়।
//           </Text>
//           <Text style={s.footerBlk}>
//             This is Software Generated Report From Bangladesh Election Commission, Signature & Seal Aren't Required.
//           </Text>
//         </View>

//       </Page>
//     </Document>
//   )
// }

// // ── Download ──────────────────────────────────────────────────────
// export async function downloadNidPdf(data: NidData, filename: string) {
//   try {
//     const blob = await pdf(<NidDocument data={data} />).toBlob()
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = filename
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     URL.revokeObjectURL(url)
//   } catch (err) {
//     console.error("PDF generation error:", err)
//     throw err
//   }
// }

import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";

// 1. Font Register (Must use for Bangla support)
Font.register({
  family: 'SolaimanLipi',
  src: 'https://cdn.jsdelivr.net/gh/at-shuvro/solaiman-lipi-font@master/SolaimanLipi.ttf' 
});

const s = StyleSheet.create({
  page: { 
    padding: 35, 
    fontFamily: 'SolaimanLipi', 
    fontSize: 10,
    backgroundColor: '#ffffff'
  },
  // Dark Green Banner
  headerBanner: {
    backgroundColor: '#1a5a30', 
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerText: { 
    flexDirection: 'column',
    marginLeft: 10 
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#ffffff' 
  },
  subTitle: { 
    fontSize: 11, 
    color: '#ffeb3b', 
    marginTop: 2 
  },
  // Main Layout
  contentWrapper: { 
    flexDirection: 'row', 
    marginTop: 10 
  },
  leftSidebar: { 
    width: 130, 
    alignItems: 'center',
    marginRight: 20
  },
  photo: { 
    width: 110, 
    height: 130, 
    border: '1px solid #999',
    borderRadius: 5,
    marginBottom: 5
  },
  qrCode: { 
    width: 90, 
    height: 90, 
    marginTop: 15 
  },
  // Table Styles
  rightSection: { 
    flex: 1 
  },
  sectionHeader: {
    backgroundColor: '#cde6ed', // Accurate Light Blue [cite: 1]
    padding: 6,
    fontSize: 11,
    border: '1px solid #b8d1d8',
    marginTop: 10,
    fontWeight: 'bold'
  },
  table: { 
    width: '100%', 
    borderLeft: '1px solid #eee', 
    borderRight: '1px solid #eee' 
  },
  row: { 
    flexDirection: 'row', 
    borderBottom: '1px solid #eee' 
  },
  label: { 
    width: '40%', 
    padding: 5, 
    backgroundColor: '#f9fafb', 
    fontSize: 9,
    color: '#333'
  },
  value: { 
    width: '60%', 
    padding: 5, 
    fontSize: 9, 
    fontWeight: 'bold' 
  },
  // Address Styling
  addressText: {
    padding: 8,
    fontSize: 8.5,
    border: '1px solid #eee',
    lineHeight: 1.5
  },
  // Footer
  footer: { 
    marginTop: 25, 
    textAlign: 'center', 
    borderTop: '1px solid #ccc', 
    paddingTop: 10 
  },
  footerRed: { 
    color: 'red', 
    fontSize: 8.5, 
    marginBottom: 3 
  },
  footerBlack: { 
    fontSize: 8, 
    color: '#444' 
  }
});

export function NidDocument({ data }: { data: any }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Banner Header [cite: 1] */}
        <View style={s.headerBanner}>
          <View style={s.headerText}>
            <Text style={s.title}>Bangladesh Election Commission</Text>
            <Text style={s.subTitle}>National Identity Registration Wing (NIDW)</Text>
          </View>
        </View>

        <View style={s.contentWrapper}>
          {/* Sidebar [cite: 1] */}
          <View style={s.leftSidebar}>
            <Image src={data.photo} style={s.photo} />
            <Text style={{fontSize: 9, fontWeight: 'bold'}}>{data.nameEn}</Text>
            {/* Generate QR as Base64 image */}
            <Image src={data.qrPhoto} style={s.qrCode} />
          </View>

          {/* Right Data Section [cite: 1, 8] */}
          <View style={s.rightSection}>
            <Text style={s.sectionHeader}>জাতীয় পরিচিতি তথ্য</Text>
            <View style={s.table}>
               <View style={s.row}><Text style={s.label}>জাতীয় পরিচয় পত্র নম্বর</Text><Text style={s.value}>{data.nid}</Text></View>
               <View style={s.row}><Text style={s.label}>পিন নম্বর</Text><Text style={s.value}>{data.pin}</Text></View>
               <View style={s.row}><Text style={s.label}>ভোটার নম্বর</Text><Text style={s.value}>{data.voterNo}</Text></View>
               <View style={s.row}><Text style={s.label}>সিরিয়াল নম্বর</Text><Text style={s.value}>{data.slNo}</Text></View>
               <View style={s.row}><Text style={s.label}>ভোটার এলাকা নম্বর</Text><Text style={s.value}>{data.voterAreaCode}</Text></View>
            </View>

            <Text style={s.sectionHeader}>ব্যক্তিগত তথ্য</Text>
            <View style={s.table}>
               <View style={s.row}><Text style={s.label}>নাম (বাংলা)</Text><Text style={s.value}>{data.name}</Text></View>
               <View style={s.row}><Text style={s.label}>নাম (ইংরেজি)</Text><Text style={s.value}>{data.nameEn}</Text></View>
               <View style={s.row}><Text style={s.label}>জন্ম তারিখ</Text><Text style={s.value}>{data.dob}</Text></View>
               <View style={s.row}><Text style={s.label}>পিতার নাম</Text><Text style={s.value}>{data.father}</Text></View>
               <View style={s.row}><Text style={s.label}>মাতার নাম</Text><Text style={s.value}>{data.mother}</Text></View>
               <View style={s.row}><Text style={s.label}>স্বামী/স্ত্রীর নাম</Text><Text style={s.value}>{data.spouse || 'N/A'}</Text></View>
            </View>

            <Text style={s.sectionHeader}>বর্তমান ঠিকানা</Text>
            <View style={s.table}>
              <Text style={s.addressText}>{data.preAddressLine}</Text>
            </View>

            <Text style={s.sectionHeader}>স্থায়ী ঠিকানা</Text>
            <View style={s.table}>
              <Text style={s.addressText}>{data.perAddressLine}</Text>
            </View>
          </View>
        </View>

        {/* Footer Note [cite: 43, 44] */}
        <View style={s.footer}>
          <Text style={s.footerRed}>উপরে প্রদর্শিত তথ্যসমূহ জাতীয় পরিচয়পত্র সংশ্লিষ্ট, ভোটার তালিকার সাথে সরাসরি সম্পর্কযুক্ত নয়।</Text>
          <Text style={s.footerBlack}>This is Software Generated Report From Bangladesh Election Commission, Signature & Seal Aren't Required.</Text>
        </View>
      </Page>
    </Document>
  );
}
import { useState } from "react";

const TERMS = {
  en: {
    title: "Dealer Terms & Platform Guidelines",
    sections: [
      {
        heading: "Vehicle Condition Disclaimer",
        content: [
          "OurAuto is a marketplace platform. We do not inspect, certify, or guarantee the mechanical or legal condition of any vehicle listed.",
          "Dealers and buyers must ensure proper vehicle inspection before completing any transaction.",
          "Payment must only be made after physically verifying the vehicle."
        ]
      },
      {
        heading: "Payment & Fraud Safety",
        content: [
          "OurAuto does not collect advance payments.",
          "All transactions are directly between dealer and buyer.",
          "Avoid accepting or sending money without verification.",
          "The platform is not responsible for disputes after sale completion."
        ]
      },
      {
        heading: "Platform Purpose",
        content: [
          "OurAuto is built as a trusted dealer network to help dealers:",
          "Sell cars faster",
          "Reach serious buyers",
          "Increase revenue",
          "Connect directly without middlemen",
          "Direct contact options like WhatsApp are provided to simplify communication."
        ]
      },
      {
        heading: "Data Privacy",
        content: [
          "We do not sell or share dealer information with third parties.",
          "Dealer contact details are visible only to enable direct buyer communication."
        ]
      },
      {
        heading: "Promotions & Future Ads",
        content: [
          "Promoted ads feature should be used only when faster sale visibility is required.",
          "Promotion is optional and not mandatory."
        ]
      },
      {
        heading: "Support",
        content: [
          "For further clarification, contact Customer Care."
        ]
      }
    ]
  },
  gu: {
    title: "ડીલર શરતો અને પ્લેટફોર્મ માર્ગદર્શિકા",
    sections: [
      {
        heading: "વાહન જવાબદારી સ્પષ્ટીકરણ",
        content: [
          "OurAuto વાહનોની યાંત્રિક અથવા કાનૂની સ્થિતિની તપાસ કરતું નથી.",
          "ગાડીની સંપૂર્ણ તપાસ કર્યા પછી જ ચુકવણી કરવી.",
          "પ્લેટફોર્મ ગાડીની સ્થિતિ માટે જવાબદાર નથી."
        ]
      },
      {
        heading: "ચુકવણી અને સુરક્ષા",
        content: [
          "અમે કોઈ પણ એડવાન્સ રકમ વસૂલ કરતા નથી.",
          "લેણદેણ સીધું ડીલર અને ખરીદદાર વચ્ચે થાય છે.",
          "ચકાસણી વગર કોઈ પણ રકમ ટ્રાન્સફર ન કરવી."
        ]
      },
      {
        heading: "પ્લેટફોર્મનો હેતુ",
        content: [
          "આ પ્લેટફોર્મ ડીલરોને:",
          "ગાડીઓ ઝડપથી વેચવામાં",
          "વધુ સારા ભાવ મેળવવામાં",
          "સીધા ગ્રાહકો સાથે જોડાવામાં મદદ કરે છે",
          "WhatsApp અને સીધી સંપર્ક સુવિધા આપવામાં આવી છે."
        ]
      },
      {
        heading: "માહિતિ સુરક્ષા",
        content: [
          "અમે તમારી માહિતી ત્રીજા પક્ષ સાથે શેર કરતા નથી."
        ]
      },
      {
        heading: "પ્રોમોશન",
        content: [
          "ઝડપી વેચાણ માટે જ પ્રોમોશનનો ઉપયોગ કરવો."
        ]
      },
      {
        heading: "સહાય માટે",
        content: [
          "વધુ માહિતી માટે Customer Care નો સંપર્ક કરો."
        ]
      }
    ]
  },
  hi: {
    title: "डीलर नियम एवं प्लेटफॉर्म दिशानिर्देश",
    sections: [
      {
        heading: "वाहन स्थिति अस्वीकरण",
        content: [
          "OurAuto किसी भी वाहन की यांत्रिक या कानूनी जांच नहीं करता।",
          "भुगतान केवल वाहन की भौतिक जांच के बाद ही करें।"
        ]
      },
      {
        heading: "भुगतान एवं सुरक्षा",
        content: [
          "हम कोई अग्रिम राशि नहीं लेते।",
          "लेन-देन सीधे डीलर और खरीदार के बीच होता है।",
          "जांच के बिना पैसा ट्रांसफर न करें।"
        ]
      },
      {
        heading: "प्लेटफॉर्म का उद्देश्य",
        content: [
          "यह प्लेटफॉर्म डीलरों को:",
          "गाड़ी जल्दी बेचने",
          "बेहतर मूल्य प्राप्त करने",
          "सीधे खरीदार से जुड़ने में सहायता करता है"
        ]
      },
      {
        heading: "डेटा सुरक्षा",
        content: [
          "हम आपकी जानकारी किसी तीसरे पक्ष को नहीं बेचते।"
        ]
      },
      {
        heading: "प्रमोशन",
        content: [
          "प्रमोशन सुविधा वैकल्पिक है।"
        ]
      },
      {
        heading: "सहायता",
        content: [
          "अधिक जानकारी के लिए Customer Care से संपर्क करें।"
        ]
      }
    ]
  }
};

export default TERMS;

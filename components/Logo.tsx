"use client"

export default function Logo() {
  return (
    <div className="flex items-center text-black dark:text-white">
      <svg
        viewBox="0 0 520 120"
        className="h-10 w-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Car silhouette */}
        <path
          d="M70 70 
             Q150 20 300 35 
             Q380 45 420 70 
             L390 70 
             Q360 55 300 50 
             Q200 45 120 70 Z"
          fill="#FFD600"
        />

        {/* Speed line accent */}
        <path
          d="M90 78 Q160 60 250 65"
          stroke="#FFD600"
          strokeWidth="4"
          fill="none"
        />

        {/* Brand text */}
        <text
          x="80"
          y="110"
          fontSize="52"
          fontWeight="700"
          letterSpacing="1"
          fill="currentColor"
        >
          OurAuto
        </text>
      </svg>
    </div>
  )
}
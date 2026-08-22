export function NexoBackground() {
  return (
    <div className="absolute inset-0 min-h-full bg-black">
      <div className="absolute inset-0">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="neonPulse1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,1)" />
              <stop offset="30%" stopColor="rgba(169,189,85,1)" />
              <stop offset="70%" stopColor="rgba(169,189,85,0.8)" />
              <stop offset="100%" stopColor="rgba(169,189,85,0)" />
            </radialGradient>
            <radialGradient id="neonPulse2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
              <stop offset="25%" stopColor="rgba(169,189,85,0.9)" />
              <stop offset="60%" stopColor="rgba(169,189,85,0.7)" />
              <stop offset="100%" stopColor="rgba(169,189,85,0)" />
            </radialGradient>
            <radialGradient id="neonPulse3" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,1)" />
              <stop offset="35%" stopColor="rgba(169,189,85,1)" />
              <stop offset="75%" stopColor="rgba(169,189,85,0.6)" />
              <stop offset="100%" stopColor="rgba(169,189,85,0)" />
            </radialGradient>
            <radialGradient id="heroTextBg" cx="30%" cy="50%" r="70%">
              <stop offset="0%" stopColor="rgba(169,189,85,0.15)" />
              <stop offset="40%" stopColor="rgba(169,189,85,0.08)" />
              <stop offset="80%" stopColor="rgba(169,189,85,0.05)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
            <filter id="heroTextBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feTurbulence baseFrequency="0.7" numOctaves="4" result="noise" />
              <feColorMatrix in="noise" type="saturate" values="0" result="monoNoise" />
              <feComponentTransfer in="monoNoise" result="alphaAdjustedNoise">
                <feFuncA type="discrete" tableValues="0.03 0.06 0.09 0.12" />
              </feComponentTransfer>
              <feComposite in="blur" in2="alphaAdjustedNoise" operator="multiply" result="noisyBlur" />
              <feMerge>
                <feMergeNode in="noisyBlur" />
              </feMerge>
            </filter>
            <linearGradient id="threadFade1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,0,0,1)" />
              <stop offset="15%" stopColor="rgba(169,189,85,0.8)" />
              <stop offset="85%" stopColor="rgba(169,189,85,0.8)" />
              <stop offset="100%" stopColor="rgba(0,0,0,1)" />
            </linearGradient>
            <linearGradient id="threadFade2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,0,0,1)" />
              <stop offset="12%" stopColor="rgba(169,189,85,0.7)" />
              <stop offset="88%" stopColor="rgba(169,189,85,0.7)" />
              <stop offset="100%" stopColor="rgba(0,0,0,1)" />
            </linearGradient>
            <linearGradient id="threadFade3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,0,0,1)" />
              <stop offset="18%" stopColor="rgba(169,189,85,0.8)" />
              <stop offset="82%" stopColor="rgba(169,189,85,0.8)" />
              <stop offset="100%" stopColor="rgba(0,0,0,1)" />
            </linearGradient>
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g>
            <ellipse cx="300" cy="350" rx="400" ry="200" fill="url(#heroTextBg)" filter="url(#heroTextBlur)" opacity="0.6" />
            <ellipse cx="350" cy="320" rx="500" ry="250" fill="url(#heroTextBg)" filter="url(#heroTextBlur)" opacity="0.4" />
            <ellipse cx="400" cy="300" rx="600" ry="300" fill="url(#heroTextBg)" filter="url(#heroTextBlur)" opacity="0.2" />

            {THREADS.map((t) => (
              <g key={t.id}>
                <path id={t.id} d={t.d} stroke={`url(#${t.fade})`} strokeWidth={t.width} fill="none" opacity={t.opacity} />
                <circle r={t.dotR} fill={`url(#${t.pulse})`} opacity="1" filter="url(#neonGlow)">
                  <animateMotion dur={t.dur} repeatCount="indefinite">
                    <mpath href={`#${t.id}`} />
                  </animateMotion>
                </circle>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}

const THREADS = [
  { id: "thread1", d: "M50 720 Q200 590 350 540 Q500 490 650 520 Q800 550 950 460 Q1100 370 1200 340", fade: "threadFade1", width: 0.8, opacity: 0.8, pulse: "neonPulse1", dotR: 2, dur: "4s" },
  { id: "thread2", d: "M80 730 Q250 620 400 570 Q550 520 700 550 Q850 580 1000 490 Q1150 400 1300 370", fade: "threadFade2", width: 1.5, opacity: 0.7, pulse: "neonPulse2", dotR: 3, dur: "5s" },
  { id: "thread3", d: "M20 710 Q180 580 320 530 Q460 480 600 510 Q740 540 880 450 Q1020 360 1200 330", fade: "threadFade3", width: 1.2, opacity: 0.8, pulse: "neonPulse1", dotR: 2.5, dur: "4.5s" },
  { id: "thread4", d: "M120 740 Q280 640 450 590 Q620 540 770 570 Q920 600 1070 510 Q1220 420 1350 390", fade: "threadFade1", width: 0.6, opacity: 0.6, pulse: "neonPulse3", dotR: 1.5, dur: "5.5s" },
  { id: "thread5", d: "M60 725 Q220 600 380 550 Q540 500 680 530 Q820 560 960 470 Q1100 380 1280 350", fade: "threadFade2", width: 1.0, opacity: 0.7, pulse: "neonPulse2", dotR: 2.2, dur: "4.2s" },
  { id: "thread6", d: "M150 735 Q300 660 480 610 Q660 560 800 590 Q940 620 1080 530 Q1220 440 1400 410", fade: "threadFade3", width: 1.3, opacity: 0.6, pulse: "neonPulse1", dotR: 2.8, dur: "5.2s" },
  { id: "thread7", d: "M40 715 Q190 585 340 535 Q490 485 630 515 Q770 545 910 455 Q1050 365 1250 335", fade: "threadFade1", width: 0.9, opacity: 0.8, pulse: "neonPulse3", dotR: 2, dur: "4.8s" },
  { id: "thread8", d: "M100 728 Q260 630 420 580 Q580 530 720 560 Q860 590 1000 500 Q1140 410 1320 380", fade: "threadFade2", width: 1.4, opacity: 0.7, pulse: "neonPulse2", dotR: 3, dur: "5.8s" },
  { id: "thread9", d: "M30 722 Q170 595 310 545 Q450 495 590 525 Q730 555 870 465 Q1010 375 1180 345", fade: "threadFade3", width: 0.5, opacity: 0.6, pulse: "neonPulse1", dotR: 1.2, dur: "6s" },
  { id: "thread10", d: "M90 732 Q240 625 390 575 Q540 525 680 555 Q820 585 960 495 Q1100 405 1300 375", fade: "threadFade1", width: 1.1, opacity: 0.8, pulse: "neonPulse3", dotR: 2.5, dur: "4.3s" },
  { id: "thread11", d: "M70 727 Q210 605 360 555 Q510 505 650 535 Q790 565 930 475 Q1070 385 1260 355", fade: "threadFade2", width: 0.4, opacity: 0.5, pulse: "neonPulse2", dotR: 1, dur: "5.7s" },
  { id: "thread12", d: "M110 738 Q270 645 430 595 Q590 545 730 575 Q870 605 1010 515 Q1150 425 1380 395", fade: "threadFade3", width: 1.5, opacity: 0.7, pulse: "neonPulse1", dotR: 3.2, dur: "4.7s" },
  { id: "thread13", d: "M45 718 Q185 588 325 538 Q465 488 605 518 Q745 548 885 458 Q1025 368 1220 338", fade: "threadFade1", width: 0.7, opacity: 0.6, pulse: "neonPulse3", dotR: 1.8, dur: "5.3s" },
  { id: "thread14", d: "M130 721 Q290 630 460 580 Q630 530 770 560 Q910 590 1050 500 Q1190 410 1350 380", fade: "threadFade2", width: 1.0, opacity: 0.8, pulse: "neonPulse2", dotR: 2.3, dur: "4.9s" },
  { id: "thread15", d: "M25 713 Q165 583 305 533 Q445 483 585 513 Q725 543 865 453 Q1005 363 1200 333", fade: "threadFade3", width: 0.3, opacity: 0.4, pulse: "neonPulse1", dotR: 0.8, dur: "6.2s" },
  { id: "thread16", d: "M85 719 Q235 605 385 555 Q535 505 675 535 Q815 565 955 475 Q1095 385 1320 355", fade: "threadFade1", width: 1.5, opacity: 0.9, pulse: "neonPulse2", dotR: 3.2, dur: "4.1s" },
  { id: "thread17", d: "M50 720 Q180 660 320 620 Q460 580 600 600 Q740 620 880 560 Q1020 500 1200 340", fade: "threadFade2", width: 0.6, opacity: 0.5, pulse: "neonPulse1", dotR: 1.5, dur: "5.1s" },
  { id: "thread18", d: "M50 720 Q200 680 350 640 Q500 600 650 620 Q800 640 950 580 Q1100 520 1200 340", fade: "threadFade3", width: 1.2, opacity: 0.7, pulse: "neonPulse2", dotR: 2.8, dur: "4.6s" },
  { id: "thread19", d: "M50 720 Q160 670 280 630 Q400 590 540 610 Q680 630 820 570 Q960 510 1200 340", fade: "threadFade1", width: 0.8, opacity: 0.6, pulse: "neonPulse3", dotR: 2, dur: "5.4s" },
  { id: "thread20", d: "M50 720 Q220 690 380 650 Q540 610 680 630 Q820 650 960 590 Q1100 530 1200 340", fade: "threadFade2", width: 1.4, opacity: 0.8, pulse: "neonPulse1", dotR: 3, dur: "4.4s" },
  { id: "thread21", d: "M50 720 Q170 675 300 635 Q430 595 570 615 Q710 635 850 575 Q990 515 1200 340", fade: "threadFade3", width: 0.5, opacity: 0.4, pulse: "neonPulse2", dotR: 1.2, dur: "5.9s" },
  { id: "thread22", d: "M50 720 Q190 745 340 705 Q490 665 630 685 Q770 705 910 645 Q1050 585 1200 340", fade: "threadFade1", width: 1.1, opacity: 0.7, pulse: "neonPulse3", dotR: 2.5, dur: "4.8s" },
  { id: "thread23", d: "M50 720 Q150 725 270 685 Q390 645 530 665 Q670 685 810 625 Q950 565 1200 340", fade: "threadFade2", width: 0.9, opacity: 0.6, pulse: "neonPulse1", dotR: 2.2, dur: "5.2s" },
  { id: "thread24", d: "M50 720 Q210 755 370 715 Q530 675 670 695 Q810 715 950 655 Q1090 595 1200 340", fade: "threadFade3", width: 1.3, opacity: 0.8, pulse: "neonPulse2", dotR: 2.9, dur: "4.2s" },
  { id: "thread25", d: "M50 720 Q165 730 290 690 Q415 650 555 670 Q695 690 835 630 Q975 570 1200 340", fade: "threadFade1", width: 0.7, opacity: 0.5, pulse: "neonPulse3", dotR: 1.8, dur: "5.6s" },
  { id: "thread26", d: "M50 720 Q230 760 390 720 Q550 680 690 700 Q830 720 970 660 Q1110 600 1200 340", fade: "threadFade2", width: 1.0, opacity: 0.7, pulse: "neonPulse1", dotR: 2.4, dur: "4.7s" },
  { id: "thread27", d: "M50 720 Q175 740 310 700 Q445 660 585 680 Q725 700 865 640 Q1005 580 1200 340", fade: "threadFade3", width: 0.4, opacity: 0.4, pulse: "neonPulse2", dotR: 1, dur: "6.1s" },
  { id: "thread28", d: "M50 720 Q195 750 350 710 Q505 670 645 690 Q785 710 925 650 Q1065 590 1200 340", fade: "threadFade1", width: 1.5, opacity: 0.9, pulse: "neonPulse3", dotR: 3.1, dur: "4.3s" },
  { id: "thread29", d: "M50 720 Q155 735 285 695 Q415 655 555 675 Q695 695 835 635 Q975 575 1200 340", fade: "threadFade2", width: 0.8, opacity: 0.6, pulse: "neonPulse1", dotR: 2, dur: "5.3s" },
  { id: "thread30", d: "M50 720 Q215 765 375 725 Q535 685 675 705 Q815 725 955 665 Q1095 605 1200 340", fade: "threadFade3", width: 1.2, opacity: 0.8, pulse: "neonPulse2", dotR: 2.7, dur: "4.5s" },
  { id: "thread31", d: "M50 720 Q185 745 325 705 Q465 665 605 685 Q745 705 885 645 Q1025 585 1200 340", fade: "threadFade1", width: 0.6, opacity: 0.5, pulse: "neonPulse3", dotR: 1.5, dur: "5.8s" },
  { id: "thread32", d: "M50 720 Q205 755 365 715 Q525 675 665 695 Q805 715 945 655 Q1085 595 1200 340", fade: "threadFade2", width: 1.4, opacity: 0.8, pulse: "neonPulse1", dotR: 3, dur: "4.1s" },
  { id: "thread33", d: "M50 720 Q160 730 295 690 Q430 650 570 670 Q710 690 850 630 Q990 570 1200 340", fade: "threadFade3", width: 0.9, opacity: 0.6, pulse: "neonPulse2", dotR: 2.1, dur: "5.1s" },
  { id: "thread34", d: "M50 720 Q225 770 385 730 Q545 690 685 710 Q825 730 965 670 Q1105 610 1200 340", fade: "threadFade1", width: 1.1, opacity: 0.7, pulse: "neonPulse3", dotR: 2.6, dur: "4.9s" },
  { id: "thread35", d: "M50 720 Q170 740 305 700 Q440 660 580 680 Q720 700 860 640 Q1000 580 1200 340", fade: "threadFade2", width: 0.3, opacity: 0.4, pulse: "neonPulse1", dotR: 0.8, dur: "6.3s" },
  { id: "thread36", d: "M50 720 Q240 715 400 675 Q560 635 700 655 Q840 675 980 615 Q1120 555 1200 340", fade: "threadFade3", width: 1.5, opacity: 0.9, pulse: "neonPulse2", dotR: 3.2, dur: "4.0s" },
];

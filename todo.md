## Landing Page

- [ ] We will make an animation of chaos stuff which goes to organized, a good dashboard appears, and we give a natural narrative - Players, Teams ,Coaches ,Training ,Memberships ,People ,Roles & Permissions
- [ ] Adding a slider which shows
- [ ] The lint command for validating html [Read here](https://www.google.com/search?q=as+we+have+npm+run+build%2C+is+there+a+another+script+for+testing+where+the+html+in+nest%2Freact+will+fail%2C+where+we+nested+elements+like+buttons&ie=UTF-8&udm=50&aep=10&ntc=1&sxsrf=APpeQns1neR-HcRS9TBnFUgptLy_HWYWzw%3A1787826226055&mstk=AUtExfAbqsk5Aj5IryPJnJsAz-B5wAc6CRfp5eZPeNBuq_pgKl3yA3_MWlAc-f2JbV4IZpWHS0NfT1lyXzFtawppp4cb03hhF3SnWvSkLYzJfBCsHysSaTL5jy4KTD0AhVeJGR4LLy2Eu22Yau8Zwf-kz8Hr_z6tQJ1BUZkL4KTbK-O-3xjm3fTIGH_2DX3GsKXnhQArhbacNnz_A2R_5RsLcAqMgCq8qSvBa_mfIXK2tcbxbAA3ROtCAUl5oRMxFKAh7gBFtOKdkZ6u0WW1zYjsN39R3qLMJD3qzfud-zHwsRJ-LUzkNrdwXBECNdcFayjVNfJlPBC5ZGurKg&aioh=3&csuir=1&cs=1&atvm=2&mtid=ZBGQauvNB-XU7M8P5LyGsAQ)
- [ ]

<style>
@-webkit-keyframes honeycomb {
  0%,
  20%,
  80%,
  100% {
    opacity: 0;
    -webkit-transform: scale(0);
    transform: scale(0);
  }

  30%,
  70% {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

@keyframes honeycomb {
  0%,
  20%,
  80%,
  100% {
    opacity: 0;
    -webkit-transform: scale(0);
    transform: scale(0);
  }

  30%,
  70% {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

.honeycomb {
  height: 24px;
  position: relative;
  width: 24px;
}

.honeycomb div {
  -webkit-animation: honeycomb 2.1s infinite backwards;
  animation: honeycomb 2.1s infinite backwards;
  background: #f3f3f3;
  height: 12px;
  margin-top: 6px;
  position: absolute;
  width: 24px;
}

.honeycomb div:after, .honeycomb div:before {
  content: '';
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  position: absolute;
  left: 0;
  right: 0;
}

.honeycomb div:after {
  top: -6px;
  border-bottom: 6px solid #f3f3f3;
}

.honeycomb div:before {
  bottom: -6px;
  border-top: 6px solid #f3f3f3;
}

.honeycomb div:nth-child(1) {
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
  left: -28px;
  top: 0;
}

.honeycomb div:nth-child(2) {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
  left: -14px;
  top: 22px;
}

.honeycomb div:nth-child(3) {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
  left: 14px;
  top: 22px;
}

.honeycomb div:nth-child(4) {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
  left: 28px;
  top: 0;
}

.honeycomb div:nth-child(5) {
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
  left: 14px;
  top: -22px;
}

.honeycomb div:nth-child(6) {
  -webkit-animation-delay: 0.5s;
  animation-delay: 0.5s;
  left: -14px;
  top: -22px;
}

.honeycomb div:nth-child(7) {
  -webkit-animation-delay: 0.6s;
  animation-delay: 0.6s;
  left: 0;
  top: 0;
}, 
</style>

<!-- From Uiverse.io by boryanakrasteva -->
<div class="honeycomb">
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</div>

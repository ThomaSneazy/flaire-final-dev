console.log("coucoulast");
gsap.registerPlugin(ScrollTrigger);

//////////////////////NAVBAR LOGO COLOR CHANGE ON SCROLL///////////////////////
const imgNav = document.querySelector(".img-nav");
const bgWhiteElements = document.querySelectorAll(".bg-white");

const DARK_COLOR = "black";
const LIGHT_COLOR = "#F9F4E8";

function updateImgNavColor() {
  const imgNavRect = imgNav.getBoundingClientRect();
  let isOverWhite = false;

  bgWhiteElements.forEach((element) => {
    const elementRect = element.getBoundingClientRect();
    if (
      imgNavRect.top < elementRect.bottom &&
      imgNavRect.bottom > elementRect.top &&
      imgNavRect.left < elementRect.right &&
      imgNavRect.right > elementRect.left
    ) {
      isOverWhite = true;
    }
  });

  if (isOverWhite) {
    imgNav.style.color = DARK_COLOR;
  } else {
    imgNav.style.color = LIGHT_COLOR;
  }
}

updateImgNavColor();

window.addEventListener("scroll", updateImgNavColor);
window.addEventListener("resize", updateImgNavColor);

//////////////////////LOADER///////////////////////
document.addEventListener("DOMContentLoaded", () => {
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Body = Matter.Body,
    Vector = Matter.Vector;

  var engine = Engine.create();
  var loader = document.querySelector(".loader");
  var loaderRect = loader.getBoundingClientRect();

  var render = Render.create({
    element: loader,
    engine: engine,
    options: {
      width: loaderRect.width,
      height: loaderRect.height,
      wireframes: false,
      background: "transparent",
    },
  });

  var ground = Bodies.rectangle(
    loaderRect.width / 2,
    loaderRect.height,
    loaderRect.width,
    50,
    { isStatic: true, render: { fillStyle: "transparent" } },
  );
  var leftWall = Bodies.rectangle(
    0,
    loaderRect.height / 2,
    50,
    loaderRect.height,
    { isStatic: true, render: { fillStyle: "transparent" } },
  );
  var rightWall = Bodies.rectangle(
    loaderRect.width,
    loaderRect.height / 2,
    50,
    loaderRect.height,
    { isStatic: true, render: { fillStyle: "transparent" } },
  );

  var isMobile = window.innerWidth <= 768;
  var baseOrbSize = 12.5 * 16;
  var orbSize = isMobile ? baseOrbSize * 0.35 : baseOrbSize;
  var specialOrbSize = baseOrbSize;
  var numOrbs = isMobile ? 20 : 14;

  var orbs = [];
  var specialOrb;

  function createSpecialOrb() {
    specialOrb = Bodies.circle(
      loaderRect.width / 2,
      loaderRect.height / 2,
      specialOrbSize / 2,
      {
        isStatic: true,
        restitution: 0.8,
        friction: 0.005,
        render: {
          fillStyle: "#f9f4e8",
          strokeStyle: "#e5e0d4",
          lineWidth: 1,
        },
      },
    );
    specialOrb.isSpecial = true;
  }

  var lineWrapper = document.querySelector(".line-wrapper");
  var orbFake = document.querySelector(".orb-fake");
  gsap.set(orbFake, { scale: 0, opacity: 0 });

  gsap.fromTo(
    lineWrapper,
    { width: "0%" },
    {
      duration: 2.2,
      width: "100%",
      ease: "power2.out",
      onComplete: function () {
        gsap.fromTo(
          orbFake,
          { scale: 0, opacity: 0 },
          {
            duration: 1.2,
            scale: 1,
            opacity: 1,
            ease: "power1.inOut",
            transformOrigin: "center center",
            onComplete: function () {
              createSpecialOrb();
              Composite.add(engine.world, [
                ground,
                leftWall,
                rightWall,
                specialOrb,
              ]);

              for (var i = 0; i < numOrbs; i++) {
                var orb = Bodies.circle(
                  Math.random() * (loaderRect.width - orbSize) + orbSize / 2,
                  -orbSize * (i + 1),
                  orbSize / 2,
                  {
                    restitution: 0.8,
                    friction: 0.005,
                    render: {
                      fillStyle: "#f9f4e8",
                      strokeStyle: "#e5e0d4",
                      lineWidth: 1,
                    },
                  },
                );
                orbs.push(orb);
              }

              Composite.add(engine.world, orbs);
              Engine.run(engine);
              Render.run(render);

              setTimeout(expandSpecialOrb, 4500);
            },
          },
        );
      },
    },
  );

  function expandSpecialOrb() {
    var center = {
      x: loaderRect.width / 2,
      y: loaderRect.height / 2,
    };

    var maxRadius = Math.max(window.innerWidth, window.innerHeight) * 1.5;

    gsap.to(specialOrb, {
      duration: 1.2,
      circleRadius: maxRadius,
      ease: "power2.inOut",
      onUpdate: function () {
        Matter.Body.setVertices(
          specialOrb,
          Matter.Vertices.create(
            Matter.Bodies.circle(center.x, center.y, specialOrb.circleRadius)
              .vertices,
          ),
        );
      },
      onComplete: function () {
        Render.stop(render);
        Engine.clear(engine);
        gsap.to(loader, {
          duration: 0.5,
          opacity: 0,
          onComplete: function () {
            loader.style.display = "none";
          },
        });
      },
    });
  }
});

//////////////////////MATTERJS PARTNAIRS GRAB AND PLAY//////////////////////
const engine = Matter.Engine.create();
const render = Matter.Render.create({
  element: document.getElementById("matter-container"),
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: "transparent",
    pixelRatio: window.devicePixelRatio,
  },
});

let ground, leftWall, rightWall, ceiling;

function createBoundaries() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  ground = Matter.Bodies.rectangle(
    viewportWidth / 2,
    viewportHeight,
    viewportWidth,
    20,
    { isStatic: true, render: { fillStyle: "transparent" } },
  );

  ceiling = Matter.Bodies.rectangle(viewportWidth / 2, 0, viewportWidth, 20, {
    isStatic: true,
    render: { fillStyle: "transparent" },
  });

  leftWall = Matter.Bodies.rectangle(
    0,
    viewportHeight / 2,
    20,
    viewportHeight,
    { isStatic: true, render: { fillStyle: "transparent" } },
  );

  rightWall = Matter.Bodies.rectangle(
    viewportWidth,
    viewportHeight / 2,
    20,
    viewportHeight,
    { isStatic: true, render: { fillStyle: "transparent" } },
  );

  Matter.World.add(engine.world, [ground, ceiling, leftWall, rightWall]);
}

createBoundaries();

function createOrbTexture(size, imageUrl) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const actualSize = size + 4;
    canvas.width = actualSize;
    canvas.height = actualSize;
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.arc(actualSize / 2, actualSize / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = "#f9f4e8";
    ctx.fillRect(0, 0, actualSize, actualSize);

    const gradient = ctx.createRadialGradient(
      actualSize * 0.3,
      actualSize * 0.3,
      0,
      actualSize * 0.5,
      actualSize * 0.5,
      size * 0.5,
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
    gradient.addColorStop(0.5, "rgba(249, 244, 232, 0.6)");
    gradient.addColorStop(0.8, "rgba(229, 224, 212, 0.8)");
    gradient.addColorStop(1, "rgba(209, 204, 192, 1)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, actualSize, actualSize);

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      let maxLogoSize = size * 0.7;
      if (imageUrl.includes("benebono-petit") || imageUrl.includes("z-petit")) {
        maxLogoSize *= 0.8;
      }

      let logoWidth, logoHeight;
      if (img.width > img.height) {
        logoWidth = maxLogoSize;
        logoHeight = (img.height / img.width) * maxLogoSize;
      } else {
        logoHeight = maxLogoSize;
        logoWidth = (img.width / img.height) * maxLogoSize;
      }

      const x = (actualSize - logoWidth) / 2;
      const y = (actualSize - logoHeight) / 2;

      ctx.globalAlpha = 0.9;
      ctx.drawImage(img, x, y, logoWidth, logoHeight);
      ctx.globalAlpha = 1.0;

      ctx.strokeStyle = "rgba(229, 224, 212, 1)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(actualSize / 2, actualSize / 2, size / 2 - 1, 0, Math.PI * 2);
      ctx.stroke();

      resolve(canvas);
    };
    img.onerror = function () {
      resolve(canvas);
    };
    img.src = imageUrl;
  });
}

function createOrbs() {
  const orbCount = 18;
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const minRadius = Math.min(viewportHeight, viewportWidth) * 0.06;
  const maxRadius = Math.min(viewportHeight, viewportWidth) * 0.12;
  const padding = Math.min(viewportHeight, viewportWidth) * 0.05;

  const imageUrls = [
    "https://uploads-ssl.webflow.com/667ebf1b9f3deeecd914b073/66a8c350e767a5aaf605a173_twin.png",
    "https://uploads-ssl.webflow.com/667ebf1b9f3deeecd914b073/66a8195d365ae1b90271d81b_pony.png",
    "https://uploads-ssl.webflow.com/667ebf1b9f3deeecd914b073/66a3a92b28e9986cc27a49c3_yousignsmall%201.png",
    "https://uploads-ssl.webflow.com/667ebf1b9f3deeecd914b073/66a683bee6046a85bd0f1e96_voodoo2.png",
    "https://uploads-ssl.webflow.com/667ebf1b9f3deeecd914b073/66a67fc32d9cc6dffc3af2f7_epsor.png",
    "https://uploads-ssl.webflow.com/667ebf1b9f3deeecd914b073/66a67fc3662062b2ef6a9637_sensitov.png",
    "https://uploads-ssl.webflow.com/667ebf1b9f3deeecd914b073/66a681d5a0aef487364aa37e_brigad.png",
    "https://uploads-ssl.webflow.com/667ebf1b9f3deeecd914b073/66a67fc35ec34d7051fef4bc_voggt.png",
    "https://uploads-ssl.webflow.com/667ebf1b9f3deeecd914b073/66a67fc3a0aef48736497b5d_mojo.png",
    "https://uploads-ssl.webflow.com/667ebf1b9f3deeecd914b073/66a67fc33d2c836983ab7de4_veesion.png",
    "https://uploads-ssl.webflow.com/667ebf1b9f3deeecd914b073/66a67fc3c3484ec606da9930_kard.png",
    "https://uploads-ssl.webflow.com/667ebf1b9f3deeecd914b073/66a67fc371ccd2ba7cd442c6_upciti.png",
    "https://uploads-ssl.webflow.com/667ebf1b9f3deeecd914b073/66a67fc34499be2c655a7e6b_gamers.png",
    "https://uploads-ssl.webflow.com/667ebf1b9f3deeecd914b073/66a67fc3574343d34e62cc5f_regate.png",
    "https://uploads-ssl.webflow.com/667ebf1b9f3deeecd914b073/66a6868fb1e29646c51f123a_z-petit.png",
    "https://uploads-ssl.webflow.com/667ebf1b9f3deeecd914b073/66a68299574343d34e6487cc_worklif.png",
    "https://uploads-ssl.webflow.com/667ebf1b9f3deeecd914b073/66a6868fbd3e635cd90fd002_benebono-petit.png",
    "https://uploads-ssl.webflow.com/667ebf1b9f3deeecd914b073/66a68299b2bff46b633b5c8d_ynergie.png",
  ];

  const specialLogos = ["gamers", "benebono-petit", "z-petit"];
  const specialLogoIndexes = imageUrls.reduce((acc, url, index) => {
    if (specialLogos.some((logo) => url.includes(logo))) {
      acc.push(index);
    }
    return acc;
  }, []);

  const shuffledImageUrls = [...imageUrls].sort(() => Math.random() - 0.5);

  const orbPromises = shuffledImageUrls.map((imageUrl, i) => {
    const isSpecialLogo = specialLogoIndexes.includes(
      imageUrls.indexOf(imageUrl),
    );
    const orbRadius = isSpecialLogo
      ? maxRadius
      : Math.random() * (maxRadius - minRadius) + minRadius;

    return createOrbTexture(orbRadius * 2, imageUrl).then((canvas) => {
      const orb = Matter.Bodies.circle(
        Math.random() * (viewportWidth - padding * 2) + padding,
        Math.random() * (viewportHeight - padding * 2) + padding,
        orbRadius,
        {
          restitution: 0.2,
          friction: 0.1,
          frictionAir: 0.03,
          density: 0.001,
          render: {
            sprite: {
              texture: canvas.toDataURL(),
              xScale: 1,
              yScale: 1,
            },
          },
        },
      );

      Matter.Body.setVelocity(orb, {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
      });
      Matter.Body.rotate(orb, Math.random() * Math.PI * 2);
      Matter.Body.setAngularVelocity(orb, (Math.random() - 0.5) * 0.02);

      return orb;
    });
  });

  Promise.all(orbPromises).then((orbs) => {
    Matter.World.add(engine.world, orbs);
  });
}

function updateCanvasDimensions() {
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  render.canvas.width = viewportWidth;
  render.canvas.height = viewportHeight;
  render.options.width = viewportWidth;
  render.options.height = viewportHeight;

  Matter.World.remove(engine.world, [ground, ceiling, leftWall, rightWall]);
  createBoundaries();

  // Mettre à jour la position des orbes
  const orbs = Matter.Composite.allBodies(engine.world);
  orbs.forEach((orb) => {
    if (orb.label !== "boundary") {
      Matter.Body.setPosition(orb, {
        x: Math.max(
          orb.circleRadius,
          Math.min(viewportWidth - orb.circleRadius, orb.position.x),
        ),
        y: Math.max(
          orb.circleRadius,
          Math.min(viewportHeight - orb.circleRadius, orb.position.y),
        ),
      });
      Matter.Body.setVelocity(orb, { x: 0, y: 0 });
    }
  });
}

window.addEventListener("resize", updateCanvasDimensions);

let isMouseDown = false;
render.canvas.addEventListener("mousedown", () => (isMouseDown = true));
render.canvas.addEventListener("mouseup", () => (isMouseDown = false));

render.canvas.addEventListener("wheel", (event) => {
  if (!isMouseDown) {
    event.preventDefault();
    const scrollAmount = event.deltaY;
    const currentScrollTop =
      window.pageYOffset || document.documentElement.scrollTop;
    window.scrollTo(0, currentScrollTop + scrollAmount);
  }
});

const mouseConstraint = Matter.MouseConstraint.create(engine, {
  element: render.canvas,
  constraint: {
    stiffness: 0.2,
    render: { visible: false },
  },
});

Matter.World.add(engine.world, mouseConstraint);

mouseConstraint.mouse.element.removeEventListener(
  "mousedown",
  mouseConstraint.mouse.mousedown,
);
mouseConstraint.mouse.element.removeEventListener(
  "mouseup",
  mouseConstraint.mouse.mouseup,
);

mouseConstraint.mouse.element.addEventListener("mousedown", (event) => {
  mouseConstraint.mouse.mousedown(event);
  matterContainer.style.cursor = "grabbing";
});

mouseConstraint.mouse.element.addEventListener("mouseup", (event) => {
  mouseConstraint.mouse.mouseup(event);
  matterContainer.style.cursor = "grab";
});
Matter.World.add(engine.world, mouseConstraint);

//document.getElementById('btn-matter').addEventListener('click', function() {
// createOrbs();
//});

let orbsCreated = false;
gsap.registerPlugin(ScrollTrigger);

function createOrbsWithAnimation() {
  createOrbs();
  orbsCreated = true;

  gsap.fromTo(
    ".orb",
    {
      opacity: 0,
      scale: 0,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      stagger: 0.2,
      ease: "elastic.out(1, 0.3)",
      //markers: true
    },
  );
}

ScrollTrigger.create({
  trigger: "#matter-container",
  start: "top center",
  //markers: true,
  onEnter: () => {
    if (!orbsCreated) {
      createOrbsWithAnimation();
    }
  },
});

function handleScroll() {
  const matterContainer = document.getElementById("matter-container");
  matterContainer.addEventListener("mouseenter", () => {
    matterContainer.style.cursor = "grab";
  });

  matterContainer.addEventListener("mouseleave", () => {
    matterContainer.style.cursor = "auto";
  });

  matterContainer.addEventListener("mousedown", () => {
    matterContainer.style.cursor = "grabbing";
  });

  matterContainer.addEventListener("mouseup", () => {
    matterContainer.style.cursor = "grab";
  });
  const containerRect = matterContainer.getBoundingClientRect();

  if (containerRect.top <= 0 && containerRect.bottom >= window.innerHeight) {
    const translateY = Math.min(
      0,
      Math.max(-containerRect.height + window.innerHeight, -window.scrollY),
    );
    Matter.Render.lookAt(render, {
      min: { x: 0, y: -translateY },
      max: { x: window.innerWidth, y: window.innerHeight - translateY },
    });
  }
}

window.addEventListener("scroll", handleScroll);

Matter.Engine.run(engine);
Matter.Render.run(render);

//////////////////////PREFOOTER TEXT BLUR TO 0//////////////////////
document.addEventListener("DOMContentLoaded", () => {
  const tutorialsTitle = document.querySelector(".tutorials__title");
  const accentElements = tutorialsTitle.querySelectorAll(".is--accent");

  gsap.set(accentElements, {
    filter: "blur(10px)",
    opacity: 0,
    y: 40,
  });

  ScrollTrigger.create({
    trigger: tutorialsTitle,
    start: "top bottom",
    end: "bottom center",
    scrub: 1,
    markers: false,
    onUpdate: (self) => {
      const progress = self.progress;
      accentElements.forEach((element, index) => {
        const elementProgress = Math.min(
          1,
          Math.max(0, (progress - index * 0.1) / 0.2),
        );
        gsap.to(element, {
          filter: `blur(${10 - 10 * elementProgress}px)`,
          opacity: 0.5 + 0.5 * elementProgress,
          y: 40 - 40 * elementProgress,
          duration: 0.1,
          overwrite: "auto",
        });
      });

      if (progress > 0.8) {
        accentElements.forEach((element) => {
          gsap.to(element, {
            filter: "blur(0px)",
            opacity: 1,
            y: 0,
            duration: 0.1,
            overwrite: "auto",
          });
        });
      }
    },
    onLeave: () => {
      accentElements.forEach((element) => {
        gsap.to(element, {
          filter: "blur(0px)",
          opacity: 1,
          y: 0,
          duration: 0.1,
        });
      });
    },
    onEnterBack: () => {
      accentElements.forEach((element, index) => {
        gsap.to(element, {
          filter: "blur(10px)",
          opacity: 0,
          y: 40,
          duration: 0.3,
          delay: index * 0.1,
        });
      });
    },
  });
});

//////////////////////ORBS SHOW ON HOVER PARTNAIRS//////////////////////
const blocks = document.querySelectorAll(".block");
const orb = document.querySelector(".orb-cursor");
const orbLogos = orb.querySelectorAll(".orb-logo");
let currentLogo = null;
let currentAnimation = null;

gsap.set(orbLogos, { opacity: 0, xPercent: 100 });

blocks.forEach((block) => {
  const desc = block.querySelector(".desc");
  const name = block.querySelector(".name");
  const textLink2 = block.querySelector(".text-link-2");

  gsap.set(desc, { height: 0, overflow: "hidden" });

  const mask = document.createElement("div");
  mask.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom right, transparent 0%, #1f1f1f 0%);
    pointer-events: none;
  `;
  desc.style.position = "relative";
  desc.appendChild(mask);

  const tl = gsap.timeline({ paused: true });

  tl.to(block, {
    height: "20rem",
    duration: 1,
    ease: "power2.out",
  })
    .to(
      desc,
      {
        height: "auto",
        duration: 1,
        ease: "power2.out",
      },
      0,
    )
    .fromTo(
      mask,
      {
        background:
          "linear-gradient(to bottom right, transparent 0%, #1f1f1f 0%)",
      },
      {
        duration: 0.8,
        ease: "power2.inOut",
        background:
          "linear-gradient(to bottom right, transparent 100%, #1f1f1f 100%)",
      },
      0,
    );

  block.addEventListener("mouseenter", () => {
    tl.play();
    showMatchingLogo(name.dataset.name);
  });

  block.addEventListener("mouseleave", () => {
    tl.reverse();
  });

  if (textLink2) {
    textLink2.addEventListener("mouseenter", () => {
      gsap.to(orb, { opacity: 0.2, duration: 0.3 });
    });
    textLink2.addEventListener("mouseleave", () => {
      gsap.to(orb, { opacity: 1, duration: 0.3 });
    });
  }

  desc.addEventListener("mouseenter", () => {
    gsap.to(orb, { opacity: 0.2, duration: 0.3 });
  });
  desc.addEventListener("mouseleave", () => {
    gsap.to(orb, { opacity: 1, duration: 0.3 });
  });
});

function showMatchingLogo(name) {
  const newLogo = Array.from(orbLogos).find(
    (logo) => logo.dataset.name.toLowerCase() === name.toLowerCase(),
  );

  if (newLogo !== currentLogo) {
    if (currentAnimation) {
      currentAnimation.kill();
    }

    const tl = gsap.timeline({
      onComplete: () => {
        currentAnimation = null;
      },
    });

    orbLogos.forEach((logo) => {
      if (logo !== newLogo) {
        tl.to(
          logo,
          {
            xPercent: -100,
            opacity: 0,
            duration: 0.2,
            ease: "power2.in",
          },
          0,
        );
      }
    });

    tl.fromTo(
      newLogo,
      { xPercent: 100, opacity: 0 },
      { xPercent: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
      0.1,
    );

    currentLogo = newLogo;
    currentAnimation = tl;
  }
}

//////////////////////CALL FORM ON CLICK//////////////////////
document.addEventListener("DOMContentLoaded", () => {
  const callForms = document.querySelectorAll(".call-form");
  const overlayBlur = document.querySelector(".overlay-blur");
  const formWrapper = document.querySelector(".form__wrapper");
  let isOpen = false;

  gsap.set(overlayBlur, {
    opacity: 0,
    display: "none",
  });

  gsap.set(formWrapper, {
    opacity: 0,
    filter: "blur(20px)",
    display: "none",
  });

  function showOverlayAndForm() {
    if (isOpen) return;
    isOpen = true;

    const tl = gsap.timeline();

    overlayBlur.style.display = "flex";
    tl.to(overlayBlur, {
      duration: 0.8,
      opacity: 1,
      ease: "power3.out",
    });

    tl.add(() => {
      formWrapper.style.display = "block";
    }, "-=0.3");

    tl.to(
      formWrapper,
      {
        duration: 0.8,
        opacity: 1,
        filter: "blur(0px)",
        ease: "power2.out",
      },
      "-=0.3",
    );
  }

  function hideOverlayAndForm() {
    if (!isOpen) return;
    isOpen = false;

    const tl = gsap.timeline({
      onComplete: () => {
        overlayBlur.style.display = "none";
        formWrapper.style.display = "none";
      },
    });

    tl.to(formWrapper, {
      duration: 0.6,
      opacity: 0,
      filter: "blur(20px)",
      ease: "power2.in",
    });

    tl.to(
      overlayBlur,
      {
        duration: 0.6,
        opacity: 0,
        ease: "power3.in",
      },
      "-=0.3",
    );
  }

  function toggleOverlayAndForm() {
    if (isOpen) {
      hideOverlayAndForm();
    } else {
      showOverlayAndForm();
    }
  }

  callForms.forEach((callForm) => {
    callForm.addEventListener("click", toggleOverlayAndForm);
  });

  overlayBlur.addEventListener("click", (event) => {
    if (event.target === overlayBlur) {
      hideOverlayAndForm();
    }
  });
});

//////////////////////BLUR ON JOB HOVER//////////////////////
document.addEventListener("DOMContentLoaded", () => {
  const jobBlocks = document.querySelectorAll(".job__block");

  jobBlocks.forEach((block) => {
    block.style.transition = "filter 0.4s ease";

    block.addEventListener("mouseenter", () => {
      jobBlocks.forEach((otherBlock) => {
        if (otherBlock !== block) {
          otherBlock.style.filter = "blur(1.3px)";
        }
      });
    });

    block.addEventListener("mouseleave", () => {
      jobBlocks.forEach((otherBlock) => {
        otherBlock.style.filter = "none";
      });
    });
  });
});

//////////////////////MARQUEE SCROLL EFFECT//////////////////////
let tlMarquee = gsap.timeline({
  scrollTrigger: {
    trigger: ".section.is-marquee",
    start: "top top",
    end: "+=300%",
    pin: true,
    scrub: 1,
    anticipatePin: 1,
  },
});

let marqueeWrappers = gsap.utils.toArray(".marquee-wrapper");

marqueeWrappers.forEach((wrapper, index) => {
  tlMarquee.from(
    wrapper,
    {
      y: "100%",
      opacity: 0,
      ease: "power2.out",
      duration: 3,
    },
    index * 1.5,
  );
});

tlMarquee.addLabel("startMarquee", ">");

marqueeWrappers.forEach((wrapper, index) => {
  const direction = index % 2 === 0 ? -1 : 1;
  const moveDistance = direction * 30;
  tlMarquee.to(
    wrapper,
    {
      x: `${moveDistance}%`,
      ease: "none",
      duration: 10,
    },
    "startMarquee",
  );
});

//////////////////////HORIZONTAL SCROLL//////////////////////

const galleryContent = document.querySelector(".gallery__content");
const galleryItems = gsap.utils.toArray(".gallery__item");
const lastItem = document.querySelector(".gallery__item.is-last");

const scrollTween = gsap.to(galleryContent, {
  x: () => -(galleryContent.scrollWidth - document.documentElement.clientWidth),
  ease: "none",
  scrollTrigger: {
    trigger: ".gallery-wrapper",
    start: "top top",
    end: () =>
      `+=${galleryContent.scrollWidth - document.documentElement.clientWidth}`,
    scrub: 1,
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  },
});

galleryItems.forEach((item, index) => {
  if (!item.classList.contains("is-last")) {
    const content = item.querySelector(".gallery__item-content");

    gsap.set(content, { filter: "blur(10px)" });

    ScrollTrigger.create({
      trigger: item,
      containerAnimation: scrollTween,
      start: "left center",
      end: "right center",
      onEnter: () => gsap.to(content, { filter: "blur(0px)", duration: 0.5 }),
      onLeave: () => gsap.to(content, { filter: "blur(10px)", duration: 0.5 }),
      onEnterBack: () =>
        gsap.to(content, { filter: "blur(0px)", duration: 0.5 }),
      onLeaveBack: () =>
        gsap.to(content, { filter: "blur(10px)", duration: 0.5 }),
    });
  }
});

if (lastItem) {
  const orbs = lastItem.querySelectorAll(".orb-horizontal");

  ScrollTrigger.create({
    trigger: lastItem,
    containerAnimation: scrollTween,
    start: "left 80%",
    end: "right 20%",
    onEnter: () => animateOrbs(orbs),
    onEnterBack: () => animateOrbs(orbs),
  });
}

function animateOrbs(orbs) {
  gsap.set(orbs, { scale: 0.2, opacity: 0 });

  gsap.to(orbs, {
    scale: 1,
    opacity: 1,
    duration: 2,
    ease: "elastic.out(1, 0.3)",
    stagger: {
      amount: 1.5,
      from: "random",
    },
  });
}

//////////////////////GSAP FADEUP LINEUP//////////////////////
function isMobile() {
  return window.innerWidth <= 768;
}

function animateFadeUp(element) {
  if (isMobile()) return;

  gsap.fromTo(
    element,
    {
      opacity: 0,
      y: "30px",
    },
    {
      duration: 0.8,
      opacity: 1,
      y: "0px",
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
      },
    },
  );
}

function animateLineUp(element) {
  if (isMobile()) return;

  const split = new SplitType(element, { types: "lines" });

  gsap.set(split.lines, {
    opacity: 0,
    y: "5px",
    transformOrigin: "0% 50%",
  });

  gsap.to(split.lines, {
    duration: 0.6,
    opacity: 1,
    y: "0px",
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
    },
  });
}

function animateOrbElastic(element) {
  if (isMobile()) return;

  gsap.from(element, {
    opacity: 0,
    scale: 0.5,
    duration: 2,
    ease: "elastic.out(1, 0.3)",
    scrollTrigger: {
      trigger: element,
      start: "top 60%",
    },
  });
}

function initAnimations() {
  if (isMobile()) return;

  document.querySelectorAll(".line-up").forEach(animateLineUp);
  document.querySelectorAll(".orb-elastic").forEach(animateOrbElastic);
  document.querySelectorAll("[fade-up]").forEach(animateFadeUp);
}

document.addEventListener("DOMContentLoaded", initAnimations);

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (!isMobile()) {
      initAnimations();
    }
  }, 250);
});

//////////////////////LENIS SCROLL//////////////////////
document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
});

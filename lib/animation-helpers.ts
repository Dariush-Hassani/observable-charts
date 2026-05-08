export function createAnimatedValue(initialTarget: number, duration = 300, onChange: (value: number) => void) {
  let current = initialTarget;
  let prev = initialTarget;
  let target = initialTarget;
  let rafId = 0;

  function setTarget(newTarget: number) {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }

    const from = current;
    const to = newTarget;

    if (from === to) return;

    target = newTarget;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // ease-in-out
      const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      current = from + (to - from) * eased;

      if (onChange) {
        onChange(current);
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        prev = to;
        rafId = 0;
      }
    };

    rafId = requestAnimationFrame(animate);
  }

  function destroy() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  function getValue() {
    return current;
  }

  return {
    setTarget,
    destroy,
    getValue,
  };
}

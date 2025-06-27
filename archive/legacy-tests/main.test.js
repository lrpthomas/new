import '../main.js';

describe('main globals', () => {
  it('exposes UI handlers on window', () => {
    expect(window.editPoint).toBeDefined();
    expect(window.deletePoint).toBeDefined();
    expect(window.togglePointSelection).toBeDefined();
  });
});

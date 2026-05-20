const { test, expect } = require('@playwright/test');

test('add, complete, and delete todo', async ({ page }) => {
  // start at baseURL
  await page.goto('/');

  // clear any existing state
  await page.evaluate(() => localStorage.removeItem('personal-todo-items'));
  await page.reload();

  // add a todo
  await page.fill('#todo-input', 'Buy milk');
  await page.click('button:has-text("Add")');
  const label = page.locator('#todo-list .todo-item .label');
  await expect(label).toHaveText('Buy milk');

  // mark done
  await page.click('#todo-list .todo-item button:has-text("Done")');
  await expect(page.locator('#todo-list .todo-item')).toHaveClass(/completed/);

  // delete
  await page.click('#todo-list .todo-item button:has-text("Delete")');
  await expect(page.locator('#todo-list')).toContainText('No tasks yet');
});

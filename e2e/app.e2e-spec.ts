import { DirectoryAppPage } from './app.po';

describe('directory-app App', function() {
  let page: DirectoryAppPage;

  beforeEach(() => {
    page = new DirectoryAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

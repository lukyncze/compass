import React from 'react';
import { expect } from 'chai';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import { NavigationItems } from './navigation-items';
import store from '../stores/store';

function renderNavigationItems(
  props?: Partial<React.ComponentProps<typeof NavigationItems>>
) {
  return render(
    <Provider store={store}>
      <NavigationItems
        isExpanded
        onAction={() => {
          /* noop */
        }}
        isDataLake={false}
        isWritable={true}
        changeFilterRegex={() => {
          /* noop */
        }}
        currentLocation={null}
        {...props}
      />
    </Provider>
  );
}

const createDatabaseText = 'Create database';
const refreshCTAText = 'Refresh databases';

describe('NavigationItems [Component]', function () {
  describe('when rendered', function () {
    it('renders the create database button', function () {
      renderNavigationItems();
      expect(screen.getByLabelText(createDatabaseText)).to.be.visible;
    });

    it('renders the refresh databases button', function () {
      renderNavigationItems();
      expect(screen.getByLabelText(refreshCTAText)).to.be.visible;
    });
  });

  describe('when rendered read only', function () {
    it('does not render the create database button', function () {
      renderNavigationItems({
        readOnly: true,
      });
      expect(screen.queryByLabelText(createDatabaseText)).to.not.exist;
    });
  });
});

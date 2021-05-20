import { formatSquirrels } from '../utils/munge-utils';
import { stubData } from '../data/stubdata.js';

const expectedStory = [
  {
    'hectare': '06A',
    'shift': 'PM',
    'date': '10122018',
    'stories': 'Area is loud and busy. Traffic, both people and motor traffic. Construction, people having dinner, horse-drawn carts, bicycle cabs. Sirens. Very noisy. Joggers.\n\nDad playing catch with his kids, with a football. Sweet.',
    'experience': true,
    'poems': true,

  }
];

test('munges squirrel stories data', async () => {
  const output = formatSquirrels(stubData);
  expect(output).toEqual(expectedStory);
});

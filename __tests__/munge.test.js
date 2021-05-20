import { formatSquirrels } from '../utils/munge-utils';
import squirrels from '../data/squirrels';

const expectedStory = [
  {
    'hectare': '02I',
    'shift': 'AM',
    'date': '10062018',
    'stories': 'Busy area, with heavy car traffic and lots of dog and human traffic and a high level of birds (making tree spotting difficult).',
    'experience': true,
    'animals': true,
    'other': 'Birds',
    'poems': true,

  }
];

test('munges squirrel stories data', async () => {
  const output = formatSquirrels(squirrels);
  expect(output).toEqual(expectedStory);
});

export function formatSquirrels(squirrels) {
  return squirrels.data.map(squirrel => {
    return {
      hectare: squirrel.hectare,
      shift: squirrel.shift,
      stories: squirrel.note_squirrel_park_stories,
      date: squirrel.date,
      experience: squirrel.story_topic_park_experience,
      animals: squirrel.story_topic_other_animals,
      poems: squirrel.story_topic_accidental_poems,
      other: squirrel.story_topic_other
    };
  });
}
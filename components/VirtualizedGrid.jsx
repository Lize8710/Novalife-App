import { Grid } from 'react-virtualized';
import CharacterCard from '@/components/Characters/CharactersCard';

export default function VirtualizedGrid({ characters, columnCount, columnWidth, rowHeight, gridWidth, rowCount, onView, onEdit, onDelete, allCharacters, getTrustedPersons }) {
  return (
    <Grid
      cellRenderer={({ columnIndex, rowIndex, key, style }) => {
        const idx = rowIndex * columnCount + columnIndex;
        const character = characters[idx];
        if (!character) return null;
        return (
          <div style={style} key={key}>
            <CharacterCard
              character={character}
              trustedPersons={getTrustedPersons(character)}
              allCharacters={allCharacters}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        );
      }}
      columnCount={columnCount}
      columnWidth={columnWidth}
      height={rowCount * rowHeight}
      rowCount={rowCount}
      rowHeight={rowHeight}
      width={gridWidth}
      style={{ overflow: 'visible' }}
    />
  );
}
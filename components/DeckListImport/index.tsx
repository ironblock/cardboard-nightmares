import { DeckList } from "../../types/Decks";

const ArenaExportSyntax = /(\d*)S?\s*(.+)\s+\((.*)\)\s(\d*)/;

export interface Props {
  onDeckListChange: (deckList: DeckList) => void;
}

export default function DeckListImport(props: Props) {
  function handleDeckListChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    props.onDeckListChange(parseDeckList(event));
  }

  function parseDeckList(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): DeckList {
    const deckList: DeckList = [];

    event.target.value.split("\n").forEach((line) => {
      const [match, quantityString, name, set, collectorNumber] =
        line.match(ArenaExportSyntax) ?? [];

      if (match) {
        deckList.push({
          name,
          set: set.toLowerCase() as Lowercase<string>,
          collectorNumber,
          quantity: Number(quantityString),
        });
      }
    });

    return deckList;
  }

  return (
    <div>
      <h1>Import Deck</h1>
      <p>
        Export deck on Archidekt, pick &quot;Copy to Arena&quot;, paste result
        here:
      </p>
      <textarea onChange={handleDeckListChange} />
    </div>
  );
}

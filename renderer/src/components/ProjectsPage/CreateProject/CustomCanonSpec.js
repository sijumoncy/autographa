import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import SelectBook from '@/components/EditorPage/Navigation/reference/SelectBook';
import { XIcon } from '@heroicons/react/solid';
import { useBibleReference } from 'bible-reference-rcl';
import PropTypes from 'prop-types';
import { ProjectContext } from '../../context/ProjectContext';

const CustomCanonSpec = ({ bibleNav, closeBibleNav, handleNav }) => {
  const initialBook = 'mat';
  const initialChapter = '1';
  const initialVerse = '1';
  const [name, setName] = React.useState();
  const [selectedBooks, setSelectedBooks] = React.useState([]);
  const {
    states: { canonSpecification, content },
    actions: { setcanonSpecification, setContent },
  } = React.useContext(ProjectContext);
  const {
    state: { bookList },
  } = useBibleReference({ initialBook, initialChapter, initialVerse });
  const saveCanon = () => {
    console.log('hi');
     console.log({ title: name, books: selectedBooks, old: content });
     setcanonSpecification(name);
     setContent([selectedBooks]);
     closeBibleNav();
   };
   React.useEffect(() => {
     if (handleNav === 'edit') {
       console.log(canonSpecification, content[0]);
        setName(canonSpecification);
        setSelectedBooks(content[0]);
     }
   }, [handleNav]);
console.log(bookList, selectedBooks);
  return (
    <Transition
      show={bibleNav}
      as={Fragment}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
      // initialFocus={cancelButtonRef}
        static
        open={bibleNav}
        onClose={closeBibleNav}
      >

        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="flex items-center justify-center h-screen ">
          <div className="w-5/12 m-auto z-50 shadow overflow-hidden sm:rounded-lg">
            <input
              type="text"
              name="new spec"
              id=""
              value={name}
              onChange={(e) => { setName(e.target.value); }}
              className="bg-white w-80 block rounded shadow-sm sm:text-sm focus:ring-gray-500 focus:border-primary border-gray-300"
            />
            <SelectBook
              bookList={bookList}
              multiSelectBook
              selectedBooks={selectedBooks}
              setSelectedBooks={setSelectedBooks}
            >
              <button
                type="button"
                className="w-9 h-9 bg-black p-2"
                onClick={closeBibleNav}
              >
                <XIcon />
              </button>
            </SelectBook>
            <button
              type="button"
              className="w-40 h-10  bg-success leading-loose rounded shadow text-xs font-base  text-white tracking-wide  font-light uppercase"
              onClick={() => saveCanon()}
            >
              Save
            </button>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
export default CustomCanonSpec;
CustomCanonSpec.propTypes = {
  bibleNav: PropTypes.bool,
  closeBibleNav: PropTypes.func,
  handleNav: PropTypes.string,
};

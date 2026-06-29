'use client';

import { HiOutlinePlus } from 'react-icons/hi2';

export default function FabrictypesHeader({ onAddClick }) {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h3 className="font-bold text-black uppercase">Fabric Types</h3>
        <p className="body-02 text-black">Manage fabric types</p>
      </div>
      <button
        onClick={onAddClick}
        className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition"
      >
        <HiOutlinePlus className="w-5 h-5" />
        Add
      </button>
    </div>
  );
}

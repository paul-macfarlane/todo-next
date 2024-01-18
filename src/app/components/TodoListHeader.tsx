"use client";

import { useState } from "react";
import Image from "next/image";
import MinusSquareRounded from "@/app/assets/MinusSquareRounded.svg";
import AddSquareRounded from "@/app/assets/AddSquareRounded.svg";
import CreateTodoForm from "@/app/components/CreateTodoForm";

export default function TodoListHeader() {
  const [creatorVisible, setCreatorVisible] = useState(false);

  return (
    <div className="py-4">
      <div className="flex justify-between items-center gap-2">
        <h1>Todos</h1>
        <button
          onClick={() => setCreatorVisible(!creatorVisible)}
          className="w-8 h-8 hover:h-10 hover:w-10"
        >
          {!creatorVisible && <Image src={AddSquareRounded} alt="add todo" />}

          {creatorVisible && <Image src={MinusSquareRounded} alt="hide form" />}
        </button>
      </div>

      {creatorVisible && <CreateTodoForm />}
    </div>
  );
}

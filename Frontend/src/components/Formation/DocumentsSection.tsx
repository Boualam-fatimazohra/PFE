// src/components/dashboardElement/DocumentsSection.jsx
import * as React from "react";

interface Document {
  title: string;
  date: string;
}

interface DocumentsSectionProps {
  documents: Document[];
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ documents }) => {
  return (
    <div className="bg-white w-6/12 max-md:w-full">
      <div className="border border-[color:var(--Neutral-400,#999)] bg-white w-full pt-[15px] pb-[27px] px-3 border-solid">
        <div className="flex w-full items-stretch gap-5 font-bold flex-wrap justify-between">
          <div className="text-black text-2xl leading-none my-auto">
            Kit Formations
          </div>
          <button className="self-stretch bg-black min-h-10 gap-[5px] overflow-hidden text-sm text-white whitespace-nowrap text-center leading-none px-5">
            Importer
          </button>
        </div>

        {documents.map((doc, index) => (
          <React.Fragment key={index}>
            <div className="border-t-[color:var(--Neutral-200,#DDD)] border-b-[color:var(--Neutral-200,#DDD)] flex w-full items-center gap-[40px_100px] flex-wrap mt-[25px] py-1.5 border-t border-solid border-b">
              <div className="text-[#333] text-base font-semibold leading-none self-stretch grow shrink w-[178px] my-auto">
                {doc.title}
              </div>
              <div className="text-[#595959] text-[13px] font-semibold leading-loose self-stretch my-auto">
                {doc.date}
              </div>
              <div className="self-stretch flex items-stretch gap-2.5">
                <button className="p-2">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/32942b86facf465bad688d8f78f5f3fb/b1d8dbe1266382def8285a9d3331a9bd6047a1d72c58c928c6934eb61deb81ec"
                    className="w-6 h-6"
                    alt="View"
                  />
                </button>
                <button className="p-2">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/32942b86facf465bad688d8f78f5f3fb/b4ab927c22bfd6ae28b7074e12d10c0a8a11127c57e1eb08e72136ec9e01b952"
                    className="w-6 h-6"
                    alt="Download"
                  />
                </button>
                <button className="p-2">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/32942b86facf465bad688d8f78f5f3fb/e678b81cd4194c7e1aaf86995b3d8eae8f8beeebe8486169552b224c44c98331"
                    className="w-6 h-6"
                    alt="Delete"
                  />
                </button>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DocumentsSection;

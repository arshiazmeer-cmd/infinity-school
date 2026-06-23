import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ZoomIn } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import infraClassroom from "@/assets/infra-classroom.jpeg";
import infraClassroom1 from "@/assets/infra-classroom-1.jpeg";
import infraClassroom2 from "@/assets/infra-classroom-2.jpeg";
import infraClassroom3 from "@/assets/infra-classroom-3.jpeg";
import infraHostel1 from "@/assets/infra-hostel-1.jpeg";
import infraHostel2 from "@/assets/infra-hostel-2.jpeg";
import infraLibrary from "@/assets/infra-library.jpeg";
import infraTransport from "@/assets/infra-transport.jpeg";

const galleryImages = [
  { id: 1, src: infraClassroom1, category: "classrooms", alt: "Nursery Classroom" },
  { id: 2, src: infraClassroom2, category: "classrooms", alt: "Activity Classroom" },
  { id: 3, src: infraClassroom, category: "classrooms", alt: "Primary Classroom" },
  { id: 4, src: infraClassroom3, category: "classrooms", alt: "Senior Classroom" },
  { id: 5, src: infraHostel1, category: "hostel", alt: "Hostel Room 1" },
  { id: 6, src: infraHostel2, category: "hostel", alt: "Hostel Room 2" },
  { id: 7, src: infraLibrary, category: "campus", alt: "Library" },
  { id: 8, src: infraTransport, category: "campus", alt: "School Bus" },
];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredImages = activeTab === "all"
    ? galleryImages
    : galleryImages.filter(img => img.category === activeTab);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-primary pt-24 pb-16 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Photo Gallery</h1>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
          Take a visual tour of our modern campus, facilities, and student life.
        </p>
      </section>

      <section className="py-20 bg-muted min-h-screen">
        <div className="container mx-auto px-6">
          <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-12 flex-wrap gap-2">
              <TabsList className="bg-white border border-border p-1 h-auto flex-wrap">
                <TabsTrigger value="all" className="px-6 py-2">All</TabsTrigger>
                <TabsTrigger value="classrooms" className="px-6 py-2">Classrooms</TabsTrigger>
                <TabsTrigger value="hostel" className="px-6 py-2">Hostel</TabsTrigger>
                <TabsTrigger value="campus" className="px-6 py-2">Campus</TabsTrigger>
              </TabsList>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-gray-200 cursor-pointer border border-border shadow-sm hover:shadow-xl transition-shadow"
                  onClick={() => setSelectedImage(img.src)}
                >
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="text-white" size={48} />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-semibold">{img.alt}</p>
                  </div>
                </div>
              ))}
            </div>

            {filteredImages.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                No images found for this category yet.
              </div>
            )}
          </Tabs>
        </div>
      </section>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent shadow-none flex justify-center items-center">
          {selectedImage && (
            <img src={selectedImage} alt="Expanded gallery view" className="max-w-full max-h-[90vh] object-contain rounded-md" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

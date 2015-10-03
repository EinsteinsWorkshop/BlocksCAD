#include <stdlib.h>
#include "libqhull/qset.h"
#include "libqhull/libqhull.h"
#include "libqhull/qhull_a.h"
#include "libqhull/poly.h"
// #include "libqhull/io.h"

int* FACET_BUFFER;
int FACET_BUFFER_SIZE = 131072;
int FACET_BUFFER_OFFSET = 0;

void appendIndex(int i) {
  // if(i >= FACET_BUFFER_SIZE) {
  //   FACET_BUFFER_SIZE *= 2;
  //   FACET_BUFFER = realloc(FACET_BUFFER, FACET_BUFFER_SIZE * 4);
  // }
  FACET_BUFFER[FACET_BUFFER_OFFSET++] = i;
}

int* run_qhull(pointT* points, int count, int dimension, int* facet_count) {
  int curlong, totlong, r_facet_count;
  facetT *facet;
  vertexT *vertex, **vertexp;
  setT *vertices;

  qh_init_A(stdin, stdout, stderr, 0, NULL);
  // qh_option("offFile", NULL, NULL);
  // qh_appendprint(qh_PRINToff);
  // qh_option("incidence", NULL, NULL);
  // qh_appendprint(qh_PRINTincidences);
  // qh_option("o",NULL,NULL);
  qh NOerrexit = 1;          
  // qh_option("Qtriangulate", NULL, NULL);
  // qh TRIangulate= True;
  qh_init_B(points, count, dimension, 0);
  qh_qhull();
  qh_triangulate();
  // qh_check_output(); 
  // qh_checkflipped_all(qh facet_list);


  // qh_produce_output();


  FACET_BUFFER_OFFSET = 0;
  r_facet_count = 0;
  FORALLfacets {
    ++r_facet_count;
    vertices= qh_facet3vertex(facet);
    FOREACHvertex_(vertices) {

      appendIndex((int)(vertex->point - points) / dimension);
    }
    appendIndex(-1);
    // qh_free(vertices);
    // qh_settempfree(&vertices);
  }
  
  // qh_freeqhull(1);
  // qh_memfreeshort(&curlong, &totlong);
  
  *facet_count = r_facet_count;
  return FACET_BUFFER;
}

int main(int argc, char** argv) {
  FACET_BUFFER = (int*)malloc(4 * 131072);
  FACET_BUFFER_SIZE = 131072;

  return 0;
}

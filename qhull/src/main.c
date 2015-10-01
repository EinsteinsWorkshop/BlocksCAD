#include <stdlib.h>
#include "libqhull/qset.h"
#include "libqhull/libqhull.h"

int* FACET_BUFFER;
int FACET_BUFFER_SIZE = 4096;
int FACET_BUFFER_OFFSET = 0;

void appendIndex(int i) {
  if(i >= FACET_BUFFER_SIZE) {
    FACET_BUFFER_SIZE *= 2;
    FACET_BUFFER = realloc(FACET_BUFFER, FACET_BUFFER_SIZE * 4);
  }
  FACET_BUFFER[FACET_BUFFER_OFFSET++] = i;
}

int* run_qhull(pointT* points, int count, int dimension, int* facet_count) {
  int curlong, totlong, r_facet_count;
  facetT *facet;
  vertexT *vertex, **vertexp;

  qh_init_A(stdin, stdout, stderr, 0, NULL);
  qh NOerrexit = 1;
  qh_init_B(points, count, dimension, 0);
  qh_qhull();
  //qh_check_output(); // we don't use the options that trigger check_output to do work
  qh_triangulate();

  FACET_BUFFER_OFFSET = 0;
  r_facet_count = 0;
  FORALLfacets {
    ++r_facet_count;
    FOREACHvertex_(facet->vertices) {
      appendIndex((int)(vertex->point - points) / dimension);
    }
    appendIndex(-1);
  }
  
  qh_freeqhull(1);
  qh_memfreeshort(&curlong, &totlong);
  
  *facet_count = r_facet_count;
  return FACET_BUFFER;
}

int main(int argc, char** argv) {
  FACET_BUFFER = (int*)malloc(4 * 4096);
  FACET_BUFFER_SIZE = 4096;

  return 0;
}

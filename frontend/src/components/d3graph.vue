<template>
  <div>
    <!-- <h2 class='text-center'>Graph in D3</h2> -->
    <v-card outlined id='container' class='svg-container'>
      <svg id='d3svg' class='svg-content'>
        {{drawGraph}}
      </svg>
    </v-card>
    <!-- <v-row>
      <v-col cols='12'><h2 class="text-center">{{elem}}</h2></v-col>
      <v-col cols='3'><p>{{parseResults.nodes}}</p></v-col>
      <v-col cols='9'><p>{{parseResults.links}}</p></v-col>
    </v-row> -->
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'Graph',
  props: ['elem', 'results'],
  data () {
    return {
      height: 400,
      width: 800,
      collisionStrength: 0.7,
      nodeRadius: 30,
      linkDistance: 100,
      lineWidth: 5
    }
  },
  mounted () {
  },
  methods: {
    drag (simulation) {
      function dragstarted (d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      }
      function dragged (d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
      }
      function dragended (d) {
        if (!d3.event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }
      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    },
    color (d) {
      // const scale = d3.scaleOrdinal(d3.schemeCategory10)
      // console.log(d.group)
      // console.log(scale(d.group))
      // return scale(d.group)

      // console.log(d3.schemeCategory10[d.group])
      return d3.schemeCategory10[d.group]
    }
  },
  computed: {
    parseResults () {
      // console.log('parsing...')
      // console.log(this.elem)
      // console.log(this.results)

      var nodes = []
      // nodes.push({ id: this.elem, group: 0 })
      var nodesAux = {}
      nodesAux[this.elem] = 0

      this.results.forEach(elem => {
        // TODO: needs improvements
        // TODO check type (uri/literal)
        if (elem.subject) {
          if (!nodesAux[elem.subject.value]) nodesAux[elem.subject.value] = 1
        }
        if (elem.object) {
          if (!nodesAux[elem.object.value]) nodesAux[elem.object.value] = 1
        }
      })
      for (const id in nodesAux) {
        const value = nodesAux[id]
        nodes.push({ id: id, group: value })
      }

      var links = []
      this.results.forEach(elem => {
        // TODO: needs improvements
        var source = this.elem
        var target = this.elem
        if (elem.subject) source = elem.subject.value
        if (elem.object) target = elem.object.value
        links.push({ source: source, target: target, value: this.lineWidth })
      })

      return { nodes, links }
    },
    drawGraph () {
      // console.log('draw graph')
      var results = this.parseResults
      var nodes = results.nodes
      var links = results.links

      const simulation = d3.forceSimulation(nodes)
        .force('center', d3.forceCenter(this.width / 2, this.height / 2))
        .force('collide', d3.forceCollide(this.nodeRadius).strength(this.collisionStrength))
        .force('link', d3.forceLink(links).id(d => d.id).distance(this.linkDistance))
        .force('charge', d3.forceManyBody())

      const svg = d3.select('#d3svg')
        .attr('preserveAspectRatio', 'xMinYMin slice')
        // TODO maybe swap altura e largura no tel pra ficar melhor
        .attr('viewBox', `0 0 ${this.width} ${this.height}`)

      // clear existing svg content (prevents redraw overlap)
      svg.selectAll('*').remove()

      const link = svg.append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', d => Math.sqrt(d.value))

      const node = svg.append('g')
        .selectAll('g')
        .data(nodes)
        .join('g')
        .call(this.drag(simulation))

      node.append('circle')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .attr('r', this.nodeRadius)
        .attr('fill', d => this.color(d))

      node.append('text')
        .attr('font-size', '0.8em')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('dy', 5)
        .text(d => d.id)

      simulation.on('tick', () => {
        link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x).attr('y2', d => d.target.y)
        node.attr('transform', d => `translate(${d.x}, ${d.y})`)
      })

      // invalidation.then(() => simulation.stop())
      return svg.node()
    }
  }
}
</script>

<style>
.svg-container {
  display: inline-block;
  position: relative;
  width: 100%;
  /* TODO: fazer um padding dinamico dependendo da largura e altura */
  padding-bottom: 50%;
  vertical-align: top;
  overflow: hidden;
}
.svg-content {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
